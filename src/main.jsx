import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import { I18n } from './lib/I18n'

import filesApp from './reducers'

import App from './components/App'
import Table from './components/Table'

const context = window.context
const lang = document.documentElement.getAttribute('lang') || 'en'

let store = createStore(filesApp)

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route component={App}>
            <Redirect from='/' to='files' />
            <Route path='files' component={Table} />
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
