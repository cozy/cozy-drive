/* global __DEVELOPMENT__, cozy */

import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import { render } from 'react-dom'
import IntentHandler from 'drive/web/modules/services'
import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/react/I18n'
import { getQueryParameter } from 'react-cozy-helpers'
import { upgradePouchDatabase } from 'drive/lib/upgradePouchDatabase'
import { schema } from 'drive/lib/doctypes'
if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('main')
  const data = root.dataset

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`

  const { intent } = getQueryParameter()

  const client = new CozyClient({
    uri: cozyUrl,
    token: data.cozyToken,
    schema
  })

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const useWebsql = isSafari || isiOS
  const offlineOptions = useWebsql ? { adapter: 'websql' } : {}

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.cozyToken,
    offline: { doctypes: ['io.cozy.files'], options: offlineOptions }
  })

  if (!useWebsql) upgradePouchDatabase('io.cozy.files')

  render(
    <I18n
      lang={data.cozyLocale}
      dictRequire={lang => require(`drive/locales/${lang}`)}
    >
      <CozyProvider client={client}>
        <IntentHandler intentId={intent} />
      </CozyProvider>
    </I18n>,
    root
  )
})
