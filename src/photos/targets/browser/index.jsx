/* global cozy __DEVELOPMENT__ */

import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import CozyClient, { CozyProvider } from 'cozy-client'
import { RealtimePlugin } from 'cozy-realtime'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import SharingProvider from 'cozy-sharing'
import { WebviewIntentProvider } from 'cozy-intent'

import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'

import appReducers from 'photos/reducers'
import AppRouter from 'photos/components/AppRouter'
import StyledApp from 'photos/components/StyledApp'
import memoize from 'lodash/memoize'

import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import appMetadata from 'photos/appMetadata'
import doctypes from './doctypes'
import cozyBar from 'lib/cozyBar'

const loggerMiddleware = createLogger()

const setupAppContext = memoize(() => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`
  const client = new CozyClient({
    uri: cozyUrl,
    token: data.token,
    appMetadata,
    schema: doctypes,
    store: false
  })
  client.registerPlugin(RealtimePlugin)
  // We still need to init cozy-client-js for the Uploader
  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.token
  })

  configureReporter()
  setCozyUrl(cozyUrl)
  let middlewares = [thunkMiddleware, loggerMiddleware]

  // Enable Redux dev tools
  const composeEnhancers =
    (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    combineReducers({ ...appReducers, cozy: client.reducer() }),
    composeEnhancers(applyMiddleware.apply(this, middlewares))
  )
  client.setStore(store)
  const locale = data.locale
  cozyBar.init({
    appName: data.app.name,
    appEditor: data.app.editor,
    cozyClient: client,
    iconPath: data.app.icon,
    lang: lang,
    replaceTitleOnMobile: true,
    appSlug: data.app.slug,
    appNamePrefix: data.app.prefix
  })
  return { store, locale, client, root }
})

const App = props => {
  return (
    <WebviewIntentProvider setBarContext={cozyBar.setWebviewContext}>
      <Provider store={props.store}>
        <I18n
          lang={props.locale}
          dictRequire={lang => require(`photos/locales/${lang}`)}
        >
          <CozyProvider client={props.client}>
            <BreakpointsProvider>
              <StyledApp>
                <SharingProvider doctype={DOCTYPE_ALBUMS} documentType="Albums">
                  {props.children}
                </SharingProvider>
              </StyledApp>
            </BreakpointsProvider>
          </CozyProvider>
        </I18n>
      </Provider>
    </WebviewIntentProvider>
  )
}

const AppWithRouter = props => (
  <App {...props}>
    <AppRouter />
  </App>
)

const init = () => {
  const { store, locale, client, root } = setupAppContext()
  render(<AppWithRouter store={store} locale={locale} client={client} />, root)
}
document.addEventListener('DOMContentLoaded', () => {
  init()
})

if (module.hot) {
  init()
  module.hot.accept()
}
