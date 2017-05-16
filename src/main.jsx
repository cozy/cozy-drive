/* global __DEVELOPMENT__ __PIWIK_TRACKER_URL__ __PIWIK_SITEID__ */
/* global cozy Piwik */

import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, hashHistory } from 'react-router'
import { I18n } from './lib/I18n'

import photosApp from './reducers'
import AppRoute from './components/AppRoute'

const loggerMiddleware = createLogger()

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

// Enable Redux dev tools
const composeEnhancers = (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(
  photosApp,
  composeEnhancers(applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  ))
)

document.addEventListener('DOMContentLoaded', () => {
  const context = window.context
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const lang = document.documentElement.getAttribute('lang') || 'en'

  cozy.client.init({
    cozyURL: `//${data.cozyDomain}`,
    token: data.cozyToken
  })

  cozy.bar.init({
    appName: data.cozyAppName,
    appEditor: data.cozyAppEditor,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale
  })

  let history = hashHistory
  try {
    var PiwikReactRouter = require('piwik-react-router')
    const piwikTracker = (Piwik.getTracker(), PiwikReactRouter({
      url: __PIWIK_TRACKER_URL__,
      siteId: __PIWIK_SITEID__,
      injectScript: false
    }))
    piwikTracker.push(['enableHeartBeatTimer'])
    history = piwikTracker.connectToHistory(hashHistory)
  } catch (err) {}

  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={history} routes={AppRoute} />
      </Provider>
    </I18n>
  ), root)
})
