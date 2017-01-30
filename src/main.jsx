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

cozy.init({
  cozyURL: 'http://cozy.local:8080/',
  token: 'TODO'
})

cozy.bar.init({
  appName: 'Photos'
})

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

// create/get mango index for files by date
store.dispatch(indexFilesByDate())

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory} routes={AppRoute} />
      </Provider>
    </I18n>
  ), document.querySelector('[role=application]'))
})
