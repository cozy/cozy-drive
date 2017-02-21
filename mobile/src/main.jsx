/* global __SENTRY_TOKEN__, cozy */

import 'babel-polyfill'

import '../../src/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, hashHistory } from 'react-router'
import Raven from 'raven-js'

import { I18n } from '../../src/lib/I18n'

import filesApp from './reducers'
import AppRoute from '../../src/components/AppRoute'
import App from '../../src/components/App'

import OnBoarding from './containers/OnBoarding'
import Settings from './containers/Settings'

import { loadState, saveState } from './lib/localStorage'
import { init } from './lib/cozy-helper'

Raven.config(`https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`).install()

const context = window.context
const lang = (navigator && navigator.language) ? navigator.language.slice(0, 2) : 'en'

const loggerMiddleware = createLogger()

document.addEventListener('DOMContentLoaded', () => {
  loadState().then(persistedState => {
    const root = document.querySelector('[role=application]')
    const data = root.dataset

    cozy.bar.init({
      appName: data.cozyAppName,
      iconPath: data.cozyIconPath,
      lang: data.cozyLocale
    })

    const store = createStore(
      filesApp,
      persistedState,
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      )
    )

    store.subscribe(() => {
      const stateToBeSaved = {
        mobile: {
          settings: store.getState().mobile.settings,
          mediaBackup: {
            uploaded: store.getState().mobile.mediaBackup.uploaded
          }
        }
      }
      saveState(stateToBeSaved)
    })

    function requireSetup (nextState, replace) {
      const url = store.getState().mobile.settings.serverUrl
      const isSetup = url !== ''
      if (!isSetup) {
        replace({
          pathname: '/onboarding',
          state: { nextPathname: nextState.location.pathname }
        })
      } else {
        init(url)
      }
    }

    render((
      <I18n context={context} lang={lang}>
        <Provider store={store}>
          <Router history={hashHistory}>
            <Route onEnter={requireSetup}>
              {AppRoute}

              <Route component={App}>
                <Route path='settings' name='mobile.settings' component={Settings} />}
              </Route>
            </Route>
            <Route path='onboarding' component={OnBoarding} />
          </Router>
        </Provider>
      </I18n>
    ), root)
  })
})
