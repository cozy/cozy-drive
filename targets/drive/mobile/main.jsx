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
import { backupContacts } from 'drive/mobile/actions/contactsBackup'
import { getTranslateFunction } from 'drive/mobile/lib/i18n'
import { scheduleNotification } from 'drive/mobile/lib/notification'
import { isIos } from 'drive/mobile/lib/device'
import {
  getLang,
  initClient,
  initBar
} from 'drive/mobile/lib/cozy-helper'
import { revokeClient } from 'drive/mobile/actions/authorization'
import { startReplication } from 'drive/mobile/actions/settings'
import { configureReporter } from 'drive/mobile/lib/reporter'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')
}

const renderAppWithPersistedState = (persistedState = {}) => {
  const cozyURL = persistedState.mobile
    ? persistedState.mobile.settings.serverUrl
    : ''
  const analyticsEnabled =
    persistedState.mobile && persistedState.mobile.settings.analytics
  configureReporter(analyticsEnabled)
  const client = initClient(cozyURL)
  const store = configureStore(client, persistedState)

  const clientInfos = store.getState().settings.client
  if (clientInfos) {
    client.isRegistered(clientInfos).then(isRegistered => {
      if (isRegistered) {
        startReplication(store.dispatch, store.getState) // don't like to pass `store.dispatch` and `store.getState` as parameters, big coupling
        initBar(client)
      } else {
        console.warn('Your device is no more connected to your server')
        store.dispatch(revokeClient())
      }
    })
  }

  document.addEventListener(
    'pause',
    () => {
      if (store.getState().mobile.settings.analytics) stopHeartBeat()
      if (store.getState().mobile.mediaBackup.currentUpload && isIos()) {
        const t = getTranslateFunction()
        scheduleNotification({
          text: t('mobile.notifications.backup_paused')
        })
      }
    },
    false
  )

  document.addEventListener(
    'resume',
    () => {
      if (store.getState().mobile.settings.analytics) startHeartBeat()
    },
    false
  )

  document.addEventListener(
    'deviceready',
    () => {
      store.dispatch(backupImages())
      if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
      if (store.getState().mobile.settings.backupContacts)
        store.dispatch(backupContacts())
    },
    false
  )

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
        <DriveMobileRouter
          history={hashHistory}
          />
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

document.addEventListener(
  'DOMContentLoaded',
  () => {
    if (!isBackgroundServiceParameter()) {
      loadState().then(renderAppWithPersistedState)
    }
  },
  false
)

document.addEventListener(
  'deviceready',
  () => {
    if (isBackgroundServiceParameter()) {
      startBackgroundService()
    }
  },
  false
)
