 /* global __DEVELOPMENT__ */
/* global cozy */

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import IntentHandler from 'drive/components/IntentHandler'
import { I18n } from 'cozy-ui/react/I18n'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

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

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const { intent } = getQueryParameter()

  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })

  render((
    <I18n lang={data.cozyLocale} dictRequire={(lang) => require(`drive/locales/${lang}`)}>
      <IntentHandler intentId={intent} />
    </I18n>), root)
})
