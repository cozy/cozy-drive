/* global cozy __DEVELOPMENT__ */

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

import { configureReporter, setCozyUrl } from 'drive/lib/reporter'

import doctypes from './doctypes'
const loggerMiddleware = createLogger()

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`
  const client = new CozyClient({
    uri: cozyUrl,
    token: data.cozyToken,
    schema: doctypes
  })

  // We still need to init cozy-client-js for the Uploader
  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.cozyToken
  })

  cozy.bar.init({
    appName: data.cozyAppName,
    appEditor: data.cozyAppEditor,
    cozyClient: client,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })
  configureReporter()
  setCozyUrl(cozyUrl)
  let history = hashHistory
  let middlewares = [thunkMiddleware, loggerMiddleware]

  if (shouldEnableTracking() && getTracker()) {
    let trackerInstance = getTracker()
    history = trackerInstance.connectToHistory(hashHistory)
    trackerInstance.track(hashHistory.getCurrentLocation()) // when using a hash history, the initial visit is not tracked by piwik react router
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
