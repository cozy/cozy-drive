/* global __DEVELOPMENT__ */
// eslint-disable-next-line no-unused-vars
import mainStyles from 'drive/styles/main.styl'

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
