/* global __DEVELOPMENT__ */
import 'babel-polyfill'

import 'drive/styles/main'
import 'drive/mobile/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { CozyProvider } from 'cozy-client'

import { I18n, initTranslation } from 'cozy-ui/react/I18n'

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
import {
  getLang,
  initClient,
  initBar,
  updateBarAccessToken,
  restoreCozyClientJs,
  resetClient
} from 'drive/mobile/lib/cozy-helper'
import { revokeClient } from 'drive/mobile/actions/authorization'
import { startReplication, setToken } from 'drive/mobile/actions/settings'
import { configureReporter } from 'drive/mobile/lib/reporter'
import {
  intentHandlerAndroid,
  intentHandlerIOS
} from 'drive/mobile/lib/intents'
import { LocalStorage as Storage } from 'cozy-client-js'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')
}

// Register callback for when the app is launched through cozydrive:// link
window.handleOpenURL = require('drive/mobile/lib/handleDeepLink').default(
  hashHistory
)

const getPreviousToken = async store => {
  if (store.getState().mobile.settings.token)
    return store.getState().mobile.settings.token
  else {
    // transition from version 1.5.3 to the next one, we recover the token stored by cozy-client-js
    const cozyClientStorage = new Storage()
    const { token } = await cozyClientStorage.load('creds')
    store.dispatch(setToken(token))
    return token
  }
}

const isClientRevoked = (error, state) => {
  return state.mobile.settings.serverUrl &&
  (error.status === 404 || error.status === 401 || error.message.match(/Client has been revoked/))
}

const startApplication = async function(store, client, polyglot) {
  configureReporter()

  let shouldInitBar = false

  try {
    const { client: clientInfos } = store.getState().settings
    const token = await getPreviousToken(store)

    const oauthClient = client.getOrCreateStackClient()
    oauthClient.setOAuthOptions(clientInfos)
    oauthClient.setCredentials(token)
    await restoreCozyClientJs(client.options.uri, clientInfos, token)

    oauthClient.onTokenRefresh = token => {
      updateBarAccessToken(token.accessToken)
      restoreCozyClientJs(client.options.uri, clientInfos, token)
      store.dispatch(setToken(token))
    }

    await oauthClient.fetchInformation()
    shouldInitBar = true
    startReplication(store.dispatch, store.getState) // don't like to pass `store.dispatch` and `store.getState` as parameters, big coupling
  } catch (e) {
    console.warn(e)
    if (isClientRevoked(e, store.getState())) {
      console.warn('Your device is not connected to your server anymore')
      store.dispatch(revokeClient())
      resetClient(client)
    }
    else if (store.getState().mobile.settings.serverUrl) {
      // the server is not responding, but it doesn't mean we're revoked yet
      shouldInitBar = true
    }
  } finally {
    if (shouldInitBar) initBar(client)
  }

  useHistoryForTracker(hashHistory)
  if (store.getState().mobile.settings.analytics)
    startTracker(store.getState().mobile.settings.serverUrl)

  const root = document.querySelector('[role=application]')

  render(
    <I18n lang={getLang()} polyglot={polyglot}>
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

    if (__DEVELOPMENT__ && typeof cordova === 'undefined') this.onDeviceReady()
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

  getPolyglot: function() {
    if (!this.polyglot) {
      this.polyglot = initTranslation(getLang(), lang =>
        require(`drive/locales/${lang}`)
      )
    }
    return this.polyglot
  },

  getStore: async function() {
    if (this.store) return this.store
    const client = await this.getClient()
    const polyglot = this.getPolyglot()
    const persistedState = await this.getPersistedState()
    this.store = configureStore(
      client,
      polyglot.t.bind(polyglot),
      persistedState
    )
    return this.store
  },

  onDeviceReady: async function() {
    const store = await this.getStore()
    const client = await this.getClient()
    const polyglot = await this.getPolyglot()

    if (window.plugins && window.plugins.intentShim) {
      window.plugins.intentShim.onIntent(intentHandlerAndroid(store))
      window.plugins.intentShim.getIntent(intentHandlerAndroid(store), err => {
        console.error('Error getting launch intent', err)
      })
    }

    if (!isBackgroundServiceParameter()) {
      startApplication(store, client, polyglot)
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
