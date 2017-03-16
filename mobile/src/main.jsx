/* global cozy, __SENTRY_TOKEN__ */

import 'babel-polyfill'

import '../../src/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, hashHistory } from 'react-router'
import RavenMiddleWare from 'redux-raven-middleware'

import { I18n } from '../../src/lib/I18n'

import filesApp from './reducers'
import MobileAppRoute from './components/MobileAppRoute'

import { loadState, saveState } from './lib/localStorage'
import { initClient, initBar, isClientRegistered, resetClient, refreshFolder, onError } from './lib/cozy-helper'
import { watchNetworkState, getConnectionType } from './lib/network'
import { onConnectionChange, setConnectionState } from './actions/network'

import { configure, getSentryUrl, getSentryConfiguration } from './lib/crash-reporter'

const loggerMiddleware = createLogger()

const renderAppWithPersistedState = persistedState => {
  const store = createStore(
    filesApp,
    persistedState,
    applyMiddleware(
      RavenMiddleWare(getSentryUrl(), getSentryConfiguration()),
      thunkMiddleware,
      loggerMiddleware
    )
  )

  store.subscribe(() => saveState({
    mobile: {
      settings: store.getState().mobile.settings,
      mediaBackup: {
        uploaded: store.getState().mobile.mediaBackup.uploaded
      }
    }
  }))

  configure(store.getState().mobile.settings.sentry)
  initClient(store.getState().mobile.settings.serverUrl)
  store.dispatch(setConnectionState(getConnectionType()))
  watchNetworkState(onConnectionChange(store.dispatch, getConnectionType))

  function requireSetup (nextState, replace, callback) {
    const client = store.getState().mobile.settings.client
    const isSetup = store.getState().mobile.settings.authorized
    if (isSetup) {
      isClientRegistered(client).then(clientIsRegistered => {
        if (clientIsRegistered) {
          const options = {
            onError: onError(store.dispatch, store.getState),
            onComplete: refreshFolder(store.dispatch, store.getState)
          }
          cozy.client.offline.startRepeatedReplication('io.cozy.files', 15, options)
          initBar()
        } else {
          onError(store.dispatch, store.getState)()
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
