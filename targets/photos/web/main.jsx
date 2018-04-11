/* global __DEVELOPMENT__ */
/* global cozy */

import 'babel-polyfill'

import 'photos/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Router, hashHistory } from 'react-router'
import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/react/I18n'

import appReducers from 'photos/reducers'
import AppRoute from 'photos/components/AppRoute'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/react/helpers/tracker'
import eventTrackerMiddleware from 'photos/middlewares/EventTracker'

import doctypes from './doctypes'

const loggerMiddleware = createLogger()

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const protocol = window.location ? window.location.protocol : 'https:'

  const client = new CozyClient({
    uri: `${protocol}//${data.cozyDomain}`,
    token: data.cozyToken,
    schema: doctypes
  })

  // We still need to init cozy-client-js for the Uploader
  cozy.client.init({
    cozyURL: `${protocol}//${data.cozyDomain}`,
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
  const composeEnhancers =
    (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    combineReducers({ ...appReducers, cozy: client.reducer() }),
    composeEnhancers(applyMiddleware.apply(this, middlewares))
  )

  render(
    <I18n lang={lang} dictRequire={lang => require(`photos/locales/${lang}`)}>
      <CozyProvider store={store} client={client}>
        <Router history={history} routes={AppRoute} />
      </CozyProvider>
    </I18n>,
    root
  )
})
