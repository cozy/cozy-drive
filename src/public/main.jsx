/* global cozy */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Router, Redirect, hashHistory, Route } from 'react-router'
import { I18n } from '../lib/I18n'

import '../styles/main'

import App from './App'
import Viewer from '../components/Viewer'

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
  const context = window.context
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
      lang: data.cozyLocale
    })
  }

  render(
    <I18n context={context} lang={lang}>
      <Router history={hashHistory}>
        <Route path='shared' component={props => <App albumId={id} {...props} />}>
          <Route path=':photoId' component={Viewer} />
        </Route>
        <Redirect from='/*' to='shared' />
      </Router>
    </I18n>
  , root)
}
