/* global __DEVELOPMENT__ */
import 'babel-polyfill'

import 'drive/styles/main'
import 'drive/mobile/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'

import { I18n } from 'cozy-ui/react/I18n'

import MobileAppRoute from 'drive/mobile/components/MobileAppRoute'

import configureStore from 'drive/mobile/store/configureStore'
import { loadState } from 'drive/mobile/store/persistedState'
import { initServices, getLang } from 'drive/mobile/lib/init'
import { startBackgroundService } from 'drive/mobile/lib/background'
import { startTracker, useHistoryForTracker, startHeartBeat, stopHeartBeat } from 'drive/mobile/lib/tracker'
import { resetClient } from 'drive/mobile/lib/cozy-helper'
import { backupImages } from 'drive/mobile/actions/mediaBackup'
import { backupContacts } from 'drive/mobile/actions/contactsBackup'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

const renderAppWithPersistedState = persistedState => {
  const store = configureStore(persistedState)

  initServices(store)

  function isRedirectedToOnboaring (nextState, replace) {
    const isNotAuthorized = !store.getState().mobile.settings.authorized
    if (isNotAuthorized) {
      resetClient()
      replace({
        pathname: '/onboarding',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }

  document.addEventListener('pause', () => {
    if (store.getState().mobile.settings.analytics) stopHeartBeat()
  }, false)

  document.addEventListener('resume', () => {
    if (store.getState().mobile.settings.analytics) startHeartBeat()
  }, false)

  document.addEventListener('deviceready', () => {
    store.dispatch(backupImages())
    if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
    if (store.getState().mobile.settings.backupContacts) store.dispatch(backupContacts())
  }, false)

  useHistoryForTracker(hashHistory)
  if (store.getState().mobile.settings.analytics) startTracker(store.getState().mobile.settings.serverUrl)

  const root = document.querySelector('[role=application]')

  render((
    <I18n lang={getLang()} dictRequire={(lang) => require(`drive/locales/${lang}`)}>
      <Provider store={store}>
        <Router history={hashHistory} routes={MobileAppRoute(isRedirectedToOnboaring)} />
      </Provider>
    </I18n>
  ), root)
}

// Allows to know if the launch of the application has been done by the service background
// @see: https://git.io/vSQBC
const isBackgroundServiceParameter = () => {
  let queryDict = {}
  location.search.substr(1).split('&').forEach(function (item) { queryDict[item.split('=')[0]] = item.split('=')[1] })

  return queryDict.backgroundservice
}

document.addEventListener('DOMContentLoaded', () => {
  if (!isBackgroundServiceParameter()) {
    loadState().then(renderAppWithPersistedState)
  }
}, false)

document.addEventListener('deviceready', () => {
  if (isBackgroundServiceParameter()) {
    startBackgroundService()
  }
}, false)
