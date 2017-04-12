import 'babel-polyfill'

import '../../src/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'

import { I18n } from '../../src/lib/I18n'

import MobileAppRoute from './components/MobileAppRoute'

import { loadState } from './lib/localStorage'
import { configureStore } from './lib/store'
import { initServices } from './lib/init'
import { startBackgroundService, stopBackgroundService } from './lib/background'
import { resetClient } from './lib/cozy-helper'
import { pingOnceADay } from './actions/timestamp'

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
  })

  document.addEventListener('deviceready', () => {
    pingOnceADayWithState()
    if (store.getState().mobile.settings.backupImages) {
      startBackgroundService()
    } else {
      stopBackgroundService()
    }
  }, false)

  const context = window.context
  const root = document.querySelector('[role=application]')
  const lang = (navigator && navigator.language) ? navigator.language.slice(0, 2) : 'en'

  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory} routes={MobileAppRoute(isRedirectedToOnboaring)} />
      </Provider>
    </I18n>
  ), root)
}

document.addEventListener('DOMContentLoaded', () =>
  loadState()
  .then(renderAppWithPersistedState)
)
