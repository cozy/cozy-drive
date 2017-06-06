/* global __DEVELOPMENT__ */
/* global cozy */

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
import { shouldEnableTracking, getTracker, createTrackerMiddleware } from './lib/tracker'
import eventTrackerMiddleware from './middlewares/EventTracker'

const loggerMiddleware = createLogger()

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

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
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })

  let history = hashHistory
  let middlewares = [thunkMiddleware, loggerMiddleware]

  if (shouldEnableTracking() && getTracker()) {
    let trackerInstance = getTracker()
    history = trackerInstance.connectToHistory(hashHistory)
    trackerInstance.track(hashHistory.getCurrentLocation()) // when using a hash history, the initial visit is not tracked by piwik react router
    middlewares.push(eventTrackerMiddleware)
    middlewares.push(createTrackerMiddleware())
  }

  // Enable Redux dev tools
  const composeEnhancers = (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    photosApp,
    composeEnhancers(applyMiddleware.apply(this, middlewares))
  )

  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={history} routes={AppRoute} />
      </Provider>
    </I18n>
  ), root)
})
