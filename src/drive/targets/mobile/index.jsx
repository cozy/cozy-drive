/* global __DEVELOPMENT__ */

import 'drive/styles/main'
import 'drive/styles/mobile'

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { CozyProvider } from 'cozy-client'

import { I18n, initTranslation } from 'cozy-ui/react/I18n'

import configureStore from 'drive/store/configureStore'
import { loadState } from 'drive/store/persistedState'

import { startBackgroundService } from 'drive/mobile/lib/background'
import { configureReporter } from 'drive/lib/reporter'
import {
  intentHandlerAndroid,
  intentHandlerIOS
} from 'drive/mobile/lib/intents'
import {
  startTracker,
  useHistoryForTracker,
  startHeartBeat,
  stopHeartBeat
} from 'drive/mobile/lib/tracker'
import { getTranslateFunction } from 'drive/mobile/lib/i18n'
import { scheduleNotification } from 'drive/mobile/lib/notification'
import { isIOSApp } from 'cozy-device-helper'

import {
  getLang,
  initClient,
  initBar,
  updateBarAccessToken,
  restoreCozyClientJs,
  resetClient,
  getOauthOptions,
  permissions
} from 'drive/mobile/lib/cozy-helper'
import DriveMobileRouter from 'drive/mobile/modules/authorization/DriveMobileRouter'
import { backupImages } from 'drive/mobile/modules/mediaBackup/duck'
import {
  revokeClient,
  getClientSettings,
  getToken,
  setToken,
  isClientRevoked
} from 'drive/mobile/modules/authorization/duck'
import { getServerUrl, isAnalyticsOn } from 'drive/mobile/modules/settings/duck'
import { startReplication } from 'drive/mobile/modules/replication/sagas'

import { handleDeeplink } from 'drive/mobile/lib/handleDeepLink'
if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')
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

class InitAppMobile {
  initialize = () => {
    this.bindEvents()
    this.stardedApp = false
    if (__DEVELOPMENT__ && typeof cordova === 'undefined') this.onDeviceReady()
    return this.startApplication()
  }

  bindEvents = () => {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
    document.addEventListener('resume', this.onResume.bind(this), false)
    document.addEventListener('pause', this.onPause.bind(this), false)
    /*We add fastclick only for iOS since Chrome removed this behavior (iOS also, but
      we still use UIWebview and not WKWebview... )*/
    if (isIOSApp()) {
      var FastClick = require('fastclick')
      document.addEventListener(
        'DOMContentLoaded',
        function() {
          FastClick.attach(document.body)
        },
        false
      )
    }
  }

  getCozyURL = async () => {
    if (this.cozyURL) return this.cozyURL
    const persistedState = (await this.getPersistedState()) || {}
    // TODO: not ideal to access the server URL in the persisted state like this...
    this.cozyURL = persistedState.mobile
      ? persistedState.mobile.settings.serverUrl
      : ''
    return this.cozyURL
  }

  getPersistedState = async () => {
    if (this.persistedState) return this.persistedState
    this.persistedState = await loadState()
    return this.persistedState
  }

  getClient = async () => {
    if (this.client) return this.client
    const cozyURL = await this.getCozyURL()
    this.client = initClient(cozyURL)
    return this.client
  }

  getPolyglot = () => {
    if (!this.polyglot) {
      this.polyglot = initTranslation(getLang(), lang =>
        require(`drive/locales/${lang}`)
      )
    }
    return this.polyglot
  }

  getStore = async () => {
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
  }

  onDeviceReady = async () => {
    const store = await this.getStore()
    const client = await this.getClient()
    const polyglot = await this.getPolyglot()

    if (window.plugins && window.plugins.intentShim) {
      window.plugins.intentShim.onIntent(intentHandlerAndroid(store))
      window.plugins.intentShim.getIntent(intentHandlerAndroid(store), err => {
        console.error('Error getting launch intent', err)
      })
    }
    if (isBackgroundServiceParameter()) {
      startBackgroundService()
    }
    store.dispatch(backupImages())
    if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
  }

  onResume = async () => {
    const store = await this.getStore()
    store.dispatch(backupImages())
    if (isAnalyticsOn(store.getState())) startHeartBeat()
  }

  onPause = async () => {
    const store = await this.getStore()
    if (isAnalyticsOn(store.getState())) stopHeartBeat()
    // TODO: selector
    if (store.getState().mobile.mediaBackup.currentUpload && isIOSApp()) {
      const t = getTranslateFunction()
      scheduleNotification({
        text: t('mobile.notifications.backup_paused')
      })
    }
  }

  startApplication = async () => {
    if (this.stardedApp) return this.afterStart()

    const store = await this.getStore()
    const client = await this.getClient()
    const polyglot = await this.getPolyglot()

    configureReporter()
    let shouldInitBar = false
    let realOauthOptions

    try {
      const clientInfos = getClientSettings(store.getState())
      /*Since we can update our OauthConfig sometimes, we need to
        override the cached one */
      realOauthOptions =
        clientInfos !== null ? { ...clientInfos, ...getOauthOptions() } : null
      const token = getToken(store.getState())
      const stackClient = client.getStackClient()

      stackClient.setOAuthOptions(realOauthOptions ? realOauthOptions : {})
      stackClient.setCredentials(token)
      await restoreCozyClientJs(
        client.options.uri,
        realOauthOptions,
        token ? token : {}
      )
      stackClient.onTokenRefresh = token => {
        updateBarAccessToken(token.accessToken)
        restoreCozyClientJs(client.options.uri, realOauthOptions, token)
        store.dispatch(setToken(token))
      }
      //In order to check if the token is good
      await stackClient.fetchJSON('GET', '/settings/disk-usage')
      shouldInitBar = true
      await store.dispatch(startReplication())
    } catch (e) {
      console.warn(e)
      if (isClientRevoked(e, store.getState())) {
        console.warn('Your device is not connected to your server anymore')
        store.dispatch(revokeClient())
        resetClient(client)
      } else if (getServerUrl(store.getState())) {
        // the server is not responding, but it doesn't mean we're revoked yet
        shouldInitBar = true
      }
    } finally {
      if (shouldInitBar) await initBar(client)
    }

    useHistoryForTracker(hashHistory)
    if (isAnalyticsOn(store.getState())) {
      startTracker(getServerUrl(store.getState()))
    }

    const root = document.querySelector('[role=application]')
    const onboarding = {
      oauth: {
        ...getOauthOptions(),
        scope: permissions
      }
    }
    return new Promise((resolve, reject) => {
      render(
        <I18n lang={getLang()} polyglot={polyglot}>
          <CozyProvider store={store} client={client}>
            <DriveMobileRouter history={hashHistory} onboarding={onboarding} />
          </CozyProvider>
        </I18n>,
        root,
        () => {
          this.stardedApp = true
          resolve()
        }
      )
    })
  }
}
const app = new InitAppMobile()
const appBooted = app.initialize()

window.handleOpenURL = async url => {
  await appBooted
  const store = await app.getStore()
  handleDeeplink(hashHistory, store, url)
}
