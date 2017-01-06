import 'babel-polyfill'

import '../../src/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import cozy from 'cozy-client-js'
import { I18n } from '../../src/lib/I18n'

import filesApp from '../../src/reducers'

import App from '../../src/components/App'
import Folder from '../../src/containers/Folder'

cozy.init({
  cozyURL: 'http://cozy.local:8080/',
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

const ComingSoon = () => (<p style='margin-left: 2em'>Mobile Coming soon!</p>)

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route component={App}>
            <Redirect from='/' to='files' />
            <Route path='files(/:file)' component={Folder} />
            <Route path='recent' component={ComingSoon} />
            <Route path='shared' component={ComingSoon} />
            <Route path='activity' component={ComingSoon} />
            <Route path='trash' component={ComingSoon} />
          </Route>
        </Router>
      </Provider>
    </I18n>
  ), document.querySelector('[role=application]'))
})
