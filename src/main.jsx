import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import { I18n } from './plugins/preact-polyglot'

import App from './components/App'

const context = window.context
const lang = document.documentElement.getAttribute('lang') || 'en'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Router history={hashHistory}>
        <Route component={(props) =>
          <App {...props} />}
        >
          <Redirect from='/' to='photos' />
          <Route
            path='photos'
            component={(props) =>
              <h2>Photos</h2>
            }
          />
          <Route
            path='albums'
            component={(props) =>
              <h2>Albums</h2>
            }
          />
          <Route
            path='shared'
            component={(props) =>
              <h2>Shared by me</h2>
            }
          />
          <Route
            path='trash'
            component={(props) =>
              <h2>Trash</h2>
            }
          />
        </Route>
      </Router>
    </I18n>
  ), document.querySelector('[role=application]'))
})
