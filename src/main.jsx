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

import filesApp from './reducers'
import AppRoute from './components/AppRoute'

const loggerMiddleware = createLogger()

const store = createStore(
  filesApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

document.addEventListener('DOMContentLoaded', () => {
  const context = window.context
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  cozy.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })

  cozy.bar.init({
    appName: data.cozyAppName,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale
  })

  render((
    <I18n context={context} lang={data.cozyLocale}>
      <Provider store={store}>
        <Router history={hashHistory} routes={AppRoute} />
      </Provider>
    </I18n>
  ), root)
})
