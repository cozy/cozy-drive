/* global __DEVELOPMENT__ */
import 'babel-polyfill'

import '../../src/styles/main'
import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'

import { I18n } from 'cozy-ui/react/I18n'

import MobileAppRoute from './components/MobileAppRoute'

import { configureStore, loadState, persistState } from '../../src/store'
import { initServices, getLang } from './lib/init'
import { startBackgroundService } from './lib/background'
import { startTracker, useHistoryForTracker, startHeartBeat, stopHeartBeat } from './lib/tracker'
import { resetClient } from './lib/cozy-helper'
import { pingOnceADay } from './actions/timestamp'
import { backupImages } from './actions/mediaBackup'
import { backupContacts } from './actions/contactsBackup'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

const renderAppWithPersistedState = persistedState => {
  const store = configureStore(persistedState)
  persistState(store)

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

  function pingOnceADayWithState () {
    const state = store.getState()
    if (state.mobile) {
      const timestamp = state.mobile.timestamp
      const analytics = state.mobile.settings.analytics
      store.dispatch(pingOnceADay(timestamp, analytics))
    }
  }

  document.addEventListener('pause', () => {
    if (store.getState().mobile.settings.analytics) stopHeartBeat()
  }, false)

  document.addEventListener('resume', () => {
    pingOnceADayWithState()
    if (store.getState().mobile.settings.analytics) startHeartBeat()
  }, false)

  document.addEventListener('deviceready', () => {
    pingOnceADayWithState()
    store.dispatch(backupImages())
    if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
    if (store.getState().mobile.settings.backupContacts) store.dispatch(backupContacts())
  }, false)

  useHistoryForTracker(hashHistory)
  if (store.getState().mobile.settings.analytics) startTracker(store.getState().mobile.settings.serverUrl)

  const root = document.querySelector('[role=application]')

  render((
    <I18n lang={getLang()} dictRequire={(lang) => require(`../../src/locales/${lang}`)}>
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
