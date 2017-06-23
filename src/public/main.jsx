/* global cozy */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Redirect, hashHistory, Route } from 'react-router'
import { I18n } from 'cozy-ui/react/I18n'

import '../styles/main'

import App from './App'
import Viewer from '../components/Viewer'
import apiReducer, { registerSchemas } from '../lib/redux-cozy-api'

const arrToObj = (obj = {}, varval = ['var', 'val']) => {
  obj[varval[0]] = varval[1]
  return obj
}

const getQueryParameter = () => window
  .location
  .search
  .substring(1)
  .split('&')
  .map(varval => varval.split('='))
  .reduce(arrToObj, {})

document.addEventListener('DOMContentLoaded', init)

function init () {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const { id, sharecode } = getQueryParameter()

  if (data.cozyDomain) {
    cozy.client.init({
      cozyURL: `//${data.cozyDomain}`,
      token: sharecode
    })
  }

  if (data.cozyAppName && data.cozyAppEditor && data.cozyIconPath && data.cozyLocale) {
    cozy.bar.init({
      appName: data.cozyAppName,
      appEditor: data.cozyAppEditor,
      iconPath: data.cozyIconPath,
      lang: data.cozyLocale,
      replaceTitleOnMobile: true
    })
  }

  const store = createStore(
    combineReducers({
      api: apiReducer
    }),
    applyMiddleware(thunkMiddleware, createLogger())
  )

  store.dispatch(registerSchemas({
    'io.cozy.photos.albums': {
      fields: ['name'],
      relations: {
        photos: {
          type: 'io.cozy.files'
        }
      }
    }
  }))

  render(
    <I18n lang={lang} dictRequire={(lang) => require(`../locales/${lang}`)}>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path='shared' component={props => <App albumId={id} {...props} />}>
            <Route path=':photoId' component={Viewer} />
          </Route>
          <Redirect from='/*' to='shared' />
        </Router>
      </Provider>
    </I18n>
  , root)
}
