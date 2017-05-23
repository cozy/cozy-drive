/* global __DEVELOPMENT__ __PIWIK_TRACKER_URL__ __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */
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

import filesApp from './reducers'
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
  filesApp,
  composeEnhancers(applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  ))
)

document.addEventListener('DOMContentLoaded', () => {
  const context = window.context
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })

  cozy.bar.init({
    appName: data.cozyAppName,
    appEditor: data.cozyAppEditor,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
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
    let userId = data.cozyDomain
    let indexOfPort = userId.indexOf(':')
    if (indexOfPort >= 0) userId = userId.substring(0, indexOfPort)
    piwikTracker.push(['setUserId', userId])
    piwikTracker.push(['setCustomDimension', __PIWIK_DIMENSION_ID_APP__, data.cozyAppName])

    history = piwikTracker.connectToHistory(hashHistory)
  } catch (err) {}

  render((
    <I18n context={context} lang={data.cozyLocale}>
      <Provider store={store}>
        <Router history={history} routes={AppRoute} />
      </Provider>
    </I18n>
  ), root)
})
