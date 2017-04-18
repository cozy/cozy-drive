/* global cozy */

import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, hashHistory } from 'react-router'
import { I18n } from './lib/I18n'

import photosApp from './reducers'
import AppRoute from './components/AppRoute'

const lang = document.documentElement.getAttribute('lang') || 'en'

const loggerMiddleware = createLogger()

const store = createStore(
  photosApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

document.addEventListener('DOMContentLoaded', () => {
  const context = window.context
  const root = document.querySelector('[role=application]')
  const data = root.dataset

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

  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory} routes={AppRoute} />
      </Provider>
    </I18n>
  ), root)
})
