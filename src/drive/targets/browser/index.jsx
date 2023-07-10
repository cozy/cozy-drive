/* global __DEVELOPMENT__ */

import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
// eslint-disable-next-line no-unused-vars
import mainStyles from 'drive/styles/main.styl'

// Uncomment to activate why-did-you-render
// https://github.com/welldone-software/why-did-you-render
// import './wdyr'

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import flag from 'cozy-flags'

import AppRoute from 'drive/web/modules/navigation/AppRoute'
import AppBarSearch from 'drive/web/modules/search/AppBarSearch'

import App from 'components/App/App'
import setupApp from './setupAppContext'

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
