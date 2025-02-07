/* global __DEVELOPMENT__ */
/* eslint-disable import/order */

// cozy-ui css import should be done before any other import
// otherwise the themes will not be supplied and the app crashes
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-viewer/dist/stylesheet.css'
import 'cozy-bar/dist/stylesheet.css'
import 'cozy-sharing/dist/stylesheet.css'
import 'cozy-dataproxy-lib/dist/stylesheet.css'

// Uncomment to activate why-did-you-render
// https://github.com/welldone-software/why-did-you-render
// import './wdyr'

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import flag from 'cozy-flags'

import setupApp from './setupAppContext'
import App from '@/components/App/App'
import AppRoute from '@/modules/navigation/AppRoute'
import AppBarSearch from '@/modules/search/components/AppBarSearch'

// ambient styles
import styles from '@/styles/main.styl' // eslint-disable-line no-unused-vars

if (__DEVELOPMENT__) {
  window.flag = flag
}

const AppComponent = props => (
  <App {...props}>
    <AppBarSearch />
    <HashRouter>
      <AppRoute />
    </HashRouter>
  </App>
)

const init = () => {
  const { locale, polyglot, client, store, root } = setupApp()

  render(
    <AppComponent
      lang={locale}
      polyglot={polyglot}
      client={client}
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
