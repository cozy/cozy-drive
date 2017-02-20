import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, hashHistory } from 'react-router'
import cozy from 'cozy-client-js'
import 'cozy-bar'
import { I18n } from './lib/I18n'

import photosApp from './reducers'
import { indexFilesByDate } from './actions/mango'
import AppRoute from './components/AppRoute'

const context = window.context
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
  const applicationElement = document.querySelector('[role=application]')

  cozy.init({
    cozyURL: `//${applicationElement.dataset.cozyStack}`,
    token: applicationElement.dataset.token
  })

  cozy.bar.init({
    appName: 'Photos'
  })

  // create/get mango index for files by date
  store.dispatch(indexFilesByDate())

  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory} routes={AppRoute} />
      </Provider>
    </I18n>
  ), applicationElement)
})
