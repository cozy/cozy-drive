/* global __DEVELOPMENT__ */

import 'cozy-ui/transpiled/react/stylesheet.css'
// eslint-disable-next-line no-unused-vars
import mainStyles from 'drive/styles/main.styl'

// Uncomment to activate why-did-you-render
// https://github.com/welldone-software/why-did-you-render
// import './wdyr'

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import flag from 'cozy-flags'

import AppRoute from 'drive/web/modules/navigation/AppRoute'

import App from 'components/App/App'
import setupApp from './setupAppContext'

if (__DEVELOPMENT__) {
  window.flag = flag
}

const AppComponent = props => (
  <App {...props}>
    <Router history={props.history} routes={AppRoute} />
  </App>
)

const init = () => {
  const { locale, polyglot, client, history, store, root } = setupApp()

  render(
    <AppComponent
      lang={locale}
      polyglot={polyglot}
      client={client}
      history={history}
      store={store}
    />,
    root
  )
}
document.addEventListener('DOMContentLoaded', () => {
  init()
})

if (module.hot) {
  init()
  module.hot.accept()
}

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .getRegistrations()
      .then(async registrations => {
        for (let registration of registrations) {
          await registration.unregister()
        }
        // eslint-disable-next-line no-console
        return console.info('Service worker unregistered')
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error during service worker registration:', error)
      })
  })
}
