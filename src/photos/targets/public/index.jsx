/* global cozy */
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Router, Redirect, hashHistory, Route } from 'react-router'
import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/react/I18n'
import { getQueryParameter } from 'react-cozy-helpers'

import doctypes from '../browser/doctypes'
import 'photos/styles/main'

import App from './App'
import PhotosViewer from 'photos/components/PhotosViewer'

document.addEventListener('DOMContentLoaded', init)

function init() {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const { id, sharecode } = getQueryParameter()

  const client = new CozyClient({
    uri: `//${data.cozyDomain}`,
    token: sharecode,
    schema: doctypes
  })

  if (
    data.cozyAppName &&
    data.cozyAppEditor &&
    data.cozyIconPath &&
    data.cozyLocale
  ) {
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
      cozy: client.reducer()
    }),
    applyMiddleware(thunkMiddleware, createLogger())
  )

  render(
    <I18n lang={lang} dictRequire={lang => require(`photos/locales/${lang}`)}>
      <CozyProvider store={store} client={client}>
        <Router history={hashHistory}>
          <Route path="shared/:albumId" component={App}>
            <Route path=":photoId" component={PhotosViewer} />
          </Route>
          <Redirect from="/*" to={`shared/${id}`} />
        </Router>
      </CozyProvider>
    </I18n>,
    root
  )
}
