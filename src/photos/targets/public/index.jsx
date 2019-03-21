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
import getSharedDocument from 'sharing/getSharedDocument'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'

import doctypes from '../browser/doctypes'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'photos/styles/main.styl'

import App from './App'
import PhotosViewer from 'photos/components/PhotosViewer'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'

document.addEventListener('DOMContentLoaded', init)

async function init() {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const { sharecode } = getQueryParameter()
  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`
  const client = new CozyClient({
    uri: cozyUrl,
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
  configureReporter()
  setCozyUrl(cozyUrl)
  const store = createStore(
    combineReducers({
      cozy: client.reducer()
    }),
    applyMiddleware(thunkMiddleware, createLogger())
  )

  let app = null
  try {
    const id = await getSharedDocument(client)
    app = (
      <CozyProvider store={store} client={client}>
        <Router history={hashHistory}>
          <Route path="shared/:albumId" component={App}>
            <Route path=":photoId" component={PhotosViewer} />
          </Route>
          <Redirect from="/*" to={`shared/${id}`} />
        </Router>
      </CozyProvider>
    )
  } catch (e) {
    app = <ErrorUnsharedComponent />
  } finally {
    render(
      <I18n lang={lang} dictRequire={lang => require(`photos/locales/${lang}`)}>
        {app}
      </I18n>,
      root
    )
  }
}
