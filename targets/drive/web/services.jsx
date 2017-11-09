 /* global __DEVELOPMENT__ */

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import IntentHandler from 'drive/ducks/services'
import { I18n } from 'cozy-ui/react/I18n'
import { CozyClient, CozyProvider } from 'cozy-client'

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

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`

  const { intent } = getQueryParameter()

  const client = new CozyClient({
    cozyURL: cozyUrl,
    token: data.cozyToken,
    offline: { doctypes: ['io.cozy.files'] }
  })

  render((
    <I18n lang={data.cozyLocale} dictRequire={(lang) => require(`drive/locales/${lang}`)}>
      <CozyProvider client={client}>
        <IntentHandler intentId={intent} />
      </CozyProvider>
    </I18n>), root)
})
