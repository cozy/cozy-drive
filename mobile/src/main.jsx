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
import { initService } from './lib/init'
import { startBackgroundService, stopBackgroundService } from './lib/background'
import { initBar, isClientRegistered, resetClient } from './lib/cozy-helper'
import { startReplication, onError } from './lib/replication'
import { pingOnceADay } from './actions/timestamp'
import { openFolder } from '../../src/actions'
import { revokeClient as reduxRevokeClient } from './actions/authorization'
import { setFirstReplication } from '../../src/actions/settings'

const renderAppWithPersistedState = persistedState => {
  const store = configureStore(persistedState)
  initService(store)

  function requireSetup (nextState, replace, callback) {
    const state = store.getState()
    const client = state.settings.client
    const isSetup = state.mobile.settings.authorized
    if (isSetup) {
      isClientRegistered(client).then(clientIsRegistered => {
        if (clientIsRegistered) {
          const firstReplication = store.getState().settings.firstReplication
          const refreshFolder = () => { store.dispatch(openFolder(store.getState().folder.id)) }
          const revokeClient = () => { store.dispatch(reduxRevokeClient()) }
          const firstReplicationFinished = () => { store.dispatch(setFirstReplication(true)) }
          startReplication(firstReplication, firstReplicationFinished, refreshFolder, revokeClient, store.dispatch, store.getState)
          initBar()
        } else {
          onError(store.dispatch)({ message: 'Client has been revoked' })
        }
        callback()
      })
    } else {
      resetClient()
      replace({
        pathname: '/onboarding',
        state: { nextPathname: nextState.location.pathname }
      })
      callback()
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
        <Router history={hashHistory} routes={MobileAppRoute(requireSetup)} />
      </Provider>
    </I18n>
  ), root)
}

document.addEventListener('DOMContentLoaded', () =>
  loadState()
  .then(renderAppWithPersistedState)
)
