/* global __DEVELOPMENT__ */
import 'babel-polyfill'

import 'drive/styles/main'
import 'drive/mobile/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { CozyProvider } from 'cozy-client'

import { I18n } from 'cozy-ui/react/I18n'

import DriveMobileRouter from 'drive/mobile/containers/DriveMobileRouter'

import configureStore from 'drive/store/configureStore'
import { loadState } from 'drive/store/persistedState'
import { startBackgroundService } from 'drive/mobile/lib/background'
import {
  startTracker,
  useHistoryForTracker,
  startHeartBeat,
  stopHeartBeat
} from 'drive/mobile/lib/tracker'
import { backupImages } from 'drive/mobile/ducks/mediaBackup'
import { getTranslateFunction } from 'drive/mobile/lib/i18n'
import { scheduleNotification } from 'drive/mobile/lib/notification'
import { isIos } from 'drive/mobile/lib/device'
import { getLang, initClient, initBar } from 'drive/mobile/lib/cozy-helper'
import { revokeClient } from 'drive/mobile/actions/authorization'
import { startReplication } from 'drive/mobile/actions/settings'
import { configureReporter } from 'drive/mobile/lib/reporter'
import { intentHandler, intentHandlerIOS } from 'drive/mobile/lib/intents'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')
}

// Register callback for when the app is launched through cozydrive:// link
window.handleOpenURL = require('drive/mobile/lib/handleDeepLink').default(
  hashHistory
)

const startApplication = async function(store, client) {
  try {
    updateUserAgent()
  } catch (err) {
    // we do nothing with this exception handling
  }
  configureReporter()
  const { client: clientInfos } = store.getState().settings
  if (clientInfos) {
    const isRegistered = await client.isRegistered(clientInfos)
    if (isRegistered) {
      startReplication(store.dispatch, store.getState) // don't like to pass `store.dispatch` and `store.getState` as parameters, big coupling
      initBar(client)
    } else {
      console.warn('Your device is no more connected to your server')
      store.dispatch(revokeClient())
    }
  }

  useHistoryForTracker(hashHistory)
  if (store.getState().mobile.settings.analytics)
    startTracker(store.getState().mobile.settings.serverUrl)

  const root = document.querySelector('[role=application]')

  render(
    <I18n
      lang={getLang()}
      dictRequire={lang => require(`drive/locales/${lang}`)}
    >
      <CozyProvider store={store} client={client}>
        <DriveMobileRouter history={hashHistory} />
      </CozyProvider>
    </I18n>,
    root
  )
}

// Allows to know if the launch of the application has been done by the service background
// @see: https://git.io/vSQBC
const isBackgroundServiceParameter = () => {
  const queryDict = location.search
    .substr(1)
    .split('&')
    .reduce((acc, item) => {
      const [prop, val] = item.split('=')
      return { ...acc, [prop]: val }
    }, {})

  return queryDict.backgroundservice
}

var app = {
  initialize: function() {
    this.bindEvents()
  },

  bindEvents: function() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
    document.addEventListener('resume', this.onResume.bind(this), false)
    document.addEventListener('pause', this.onPause.bind(this), false)
  },

  getCozyURL: async function() {
    if (this.cozyURL) return this.cozyURL
    const persistedState = (await this.getPersistedState()) || {}
    this.cozyURL = persistedState.mobile
      ? persistedState.mobile.settings.serverUrl
      : ''
    return this.cozyURL
  },

  getPersistedState: async function() {
    if (this.persistedState) return this.persistedState
    this.persistedState = await loadState()
    return this.persistedState
  },

  getClient: async function() {
    if (this.client) return this.client
    const cozyURL = await this.getCozyURL()
    this.client = initClient(cozyURL)
    return this.client
  },

  getStore: async function() {
    if (this.store) return this.store
    const client = await this.getClient()
    const persistedState = await this.getPersistedState()
    this.store = configureStore(client, persistedState)
    return this.store
  },

  onDeviceReady: async function() {
    const store = await this.getStore()
    const client = await this.getClient()
    window.plugins.intentShim.onIntent(intentHandler(store))
    window.plugins.intentShim.getIntent(intentHandler(store), err => {
      console.error('Error getting launch intent', err)
    })
    cordova.openwith.init(() => {
      cordova.openwith.setLoggedIn(true)
      cordova.openwith.addHandler(intentHandlerIOS(store))
    }, err => console.warn('Error initilizaing openwith iOS', err))

    if (!isBackgroundServiceParameter()) {
      startApplication(store, client)
    } else {
      startBackgroundService()
    }

    if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
    store.dispatch(backupImages())
  },

  onResume: async function() {
    const store = await this.getStore()
    store.dispatch(backupImages())
    if (store.getState().mobile.settings.analytics) startHeartBeat()
  },

  onPause: async function() {
    const store = await this.getStore()
    if (store.getState().mobile.settings.analytics) stopHeartBeat()
    if (store.getState().mobile.mediaBackup.currentUpload && isIos()) {
      const t = getTranslateFunction()
      scheduleNotification({
        text: t('mobile.notifications.backup_paused')
      })
    }
  }
}

app.initialize()
