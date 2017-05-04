 /* global __DEVELOPMENT__ */
/* global cozy */

import 'babel-polyfill'

import './styles/services'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { I18n } from './lib/I18n'

import filesApp from './reducers'
import IntentService from './containers/IntentService'


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

  render((
    <I18n context={context} lang={data.cozyLocale}>
      <Provider store={store}>
        <IntentService window={window} />
      </Provider>
    </I18n>
  ), root)
})
