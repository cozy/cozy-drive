import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import cozy from 'cozy-client-js'
import { I18n } from './lib/I18n'

import filesApp from './reducers'

import App from './components/App'
import Table from './components/Table'
import Folder from './containers/Folder'

cozy.init({
  url: 'http://cozy.local:8080/',
  token: 'TODO'
})

const context = window.context
const lang = document.documentElement.getAttribute('lang') || 'en'

const loggerMiddleware = createLogger()

const store = createStore(
  filesApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route component={App}>
            <Redirect from='/' to='files' />
            <Route path='files(/:file)' component={Folder} />
            <Route path='recent' component={Table} />
            <Route path='shared' component={Table} />
            <Route path='activity' component={Table} />
            <Route path='trash' component={Table} />
          </Route>
        </Router>
      </Provider>
    </I18n>
  ), document.querySelector('[role=application]'))
})
