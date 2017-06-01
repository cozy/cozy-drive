import 'babel-polyfill'

import '../../src/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'

import { I18n, _polyglot } from '../../src/lib/I18n'

import MobileAppRoute from './components/MobileAppRoute'

import { loadState } from './lib/localStorage'
import { configureStore } from './lib/store'
import { initServices, getLang } from './lib/init'
import { startBackgroundService } from './lib/background'
import { resetClient } from './lib/cozy-helper'
import { pingOnceADay } from './actions/timestamp'
import { backupImages } from './actions/mediaBackup'

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

  function pingOnceADayWithState () {
    const state = store.getState()
    if (state.mobile) {
      const timestamp = state.mobile.timestamp
      const analytics = state.mobile.settings.analytics
      store.dispatch(pingOnceADay(timestamp, analytics))
    }
  }

  document.addEventListener('resume', () => {
    pingOnceADayWithState()
  }, false)

  const launchBackup = () => {
    if (_polyglot) {
      const path = _polyglot.t('mobile.settings.media_backup.media_folder')
      store.dispatch(backupImages(path))
    } else {
      setTimeout(launchBackup, 3 * 1000)
    }
  }

  document.addEventListener('deviceready', () => {
    pingOnceADayWithState()
    setTimeout(launchBackup, 3 * 1000)
    if (navigator && navigator.splashscreen) navigator.splashscreen.hide()
  }, false)

  const context = window.context
  const root = document.querySelector('[role=application]')

  render((
    <I18n context={context} lang={getLang()}>
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
