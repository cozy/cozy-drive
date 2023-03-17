import 'cozy-ui/transpiled/react/stylesheet.css'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Router, Redirect, hashHistory, Route } from 'react-router'
import CozyClient, { CozyProvider } from 'cozy-client'
import { RealtimePlugin } from 'cozy-realtime'

import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import { getQueryParameter } from 'react-cozy-helpers'
import getSharedDocument from 'cozy-sharing/dist/getSharedDocument'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'

import appMetadata from 'photos/appMetadata'
import doctypes from '../browser/doctypes'

import App from './App'
import PhotosViewer from 'photos/components/PhotosViewer'
import StyledApp from 'photos/components/StyledApp'

import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import { WebviewIntentProvider } from 'cozy-intent'
import cozyBar from 'lib/cozyBar'

document.addEventListener('DOMContentLoaded', init)

async function init() {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const { sharecode } = getQueryParameter()
  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`
  const client = new CozyClient({
    uri: cozyUrl,
    token: sharecode,
    appMetadata,
    schema: doctypes,
    store: false
  })

  client.registerPlugin(RealtimePlugin)

  configureReporter()
  setCozyUrl(cozyUrl)
  const store = createStore(
    combineReducers({
      cozy: client.reducer()
    }),
    applyMiddleware(thunkMiddleware, createLogger())
  )

  let app = null
  client.setStore(store)
  if (data.app.name && data.app.editor && data.app.icon && data.locale) {
    cozyBar.init({
      appName: data.app.name,
      appEditor: data.app.editor,
      cozyClient: client,
      iconPath: data.app.icon,
      lang: data.locale,
      replaceTitleOnMobile: true,
      isPublic: true,
      appSlug: data.app.slug,
      appNamePrefix: data.app.prefix
    })
  }
  try {
    const { id } = await getSharedDocument(client)
    app = (
      <WebviewIntentProvider>
        <Provider store={store}>
          <CozyProvider client={client}>
            <BreakpointsProvider>
              <StyledApp>
                <Router history={hashHistory}>
                  <Route path="shared/:albumId" component={App}>
                    <Route path=":photoId" component={PhotosViewer} />
                  </Route>
                  <Redirect from="/*" to={`shared/${id}`} />
                </Router>
              </StyledApp>
            </BreakpointsProvider>
          </CozyProvider>
        </Provider>
      </WebviewIntentProvider>
    )
  } catch (e) {
    app = <ErrorUnsharedComponent />
  } finally {
    render(
      <I18n lang={lang} dictRequire={lang => require(`photos/locales/${lang}`)}>
        <>
          <StyledApp>
            {app}
            <Sprite />
          </StyledApp>
        </>
      </I18n>,
      root
    )
  }
}
