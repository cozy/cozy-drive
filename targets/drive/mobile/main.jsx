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
import { addToUploadQueue } from '../../../src/drive/ducks/upload/index'
import { getEntry } from '../../../src/drive/mobile/lib/filesystem'
import { ROOT_DIR_ID } from '../../../src/drive/constants/config'
import { uploadedFile } from '../../../src/drive/actions/index'
import { alertShow } from 'cozy-ui/react/Alerter'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')
}

// Register callback for when the app is launched through cozydrive:// link
window.handleOpenURL = require('drive/mobile/lib/handleDeepLink').default(
  hashHistory
)

function uploadIntent(intent, store) {
  if (intent['android.intent.extra.STREAM']) {
    const contentFiles = Array.isArray(intent['android.intent.extra.STREAM'])
      ? intent['android.intent.extra.STREAM']
      : [intent['android.intent.extra.STREAM']]
    contentFiles.forEach(content => {
      window.FilePath.resolveNativePath(
        content,
        async filePath => {
          console.log('Here is the filepath', filePath)
          const dirEntry = await getEntry(filePath)
          console.log('Here is the directoryentry', dirEntry)
          dirEntry.file(file => {
            file.lastModifiedDate = new Date(file.lastModifiedDate)
            console.log('this is binary file', file)
            store.dispatch(
              addToUploadQueue(
                [file],
                ROOT_DIR_ID,
                uploadedFile,
                (loaded, quotas, conflicts, errors) => {
                  let action = { type: '' } // dummy action, we only use it to trigger an alert notification
                  if (conflicts.length > 0) {
                    action.alert = alertShow(
                      'upload.alert.success_conflicts',
                      {
                        smart_count: loaded.length,
                        conflictNumber: conflicts.length
                      },
                      'info'
                    )
                  } else if (errors.length > 0) {
                    action.alert = alertShow(
                      'upload.alert.errors',
                      null,
                      'error'
                    )
                  } else {
                    action.alert = alertShow(
                      'upload.alert.success',
                      { smart_count: loaded.length },
                      'success'
                    )
                  }

                  return action
                }
              )
            )
          })
          // need to use addToUploadQueue() to upload files
        },
        error => {
          console.error('Here is the error', error.message)
        }
      )
    })
  }
}

function registerShareWithCozyDriveIntent(store) {
  console.log('registerShareWithCozyDriveIntent')
  window.plugins.intentShim.onIntent(function({
    action,
    extras = 'No extras in intent'
  }) {
    console.log('Action' + JSON.stringify(action))
    console.log('Launch Intent Extras: ' + JSON.stringify(extras))
    uploadIntent(extras, store)
  })
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
  store: {},

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

  startApplication: async function() {
    const persistedState = await loadState()
    const cozyURL = persistedState.mobile
      ? persistedState.mobile.settings.serverUrl
      : ''
    configureReporter()
    const client = initClient(cozyURL)
    this.store = configureStore(client, persistedState)
    const store = this.store

    const clientInfos = store.getState().settings.client
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
  },

  onDeviceReady: async function() {
    if (!isBackgroundServiceParameter()) {
      this.startApplication()
    } else {
      startBackgroundService()
    }

    // this.store.dispatch(backupImages())
    if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
    registerShareWithCozyDriveIntent(this.store)
  },

  onResume: function() {
    this.store.dispatch(backupImages())
    if (this.store.getState().mobile.settings.analytics) startHeartBeat()
    registerShareWithCozyDriveIntent(this.store)
  },

  onPause: function() {
    if (this.store.getState().mobile.settings.analytics) stopHeartBeat()
    if (this.store.getState().mobile.mediaBackup.currentUpload && isIos()) {
      const t = getTranslateFunction()
      scheduleNotification({
        text: t('mobile.notifications.backup_paused')
      })
    }
  }
}

app.initialize()
