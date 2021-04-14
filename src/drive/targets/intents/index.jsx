/* global cozy */

import 'cozy-ui/transpiled/react/stylesheet.css'
import 'whatwg-fetch'

import React from 'react'
import { render } from 'react-dom'

import { getQueryParameter } from 'react-cozy-helpers'
import CozyClient from 'cozy-client'

import DriveProvider from 'drive/lib/DriveProvider'
import registerClientPlugins from 'drive/lib/registerClientPlugins'
import { schema } from 'drive/lib/doctypes'
import appMetadata from 'drive/appMetadata'
import IntentHandler from 'drive/web/modules/services'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('main')
  const data = root.dataset

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`

  const { intent } = getQueryParameter()

  const client = new CozyClient({
    uri: cozyUrl,
    token: data.cozyToken,
    appMetadata,
    schema
  })

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.cozyToken
  })
  registerClientPlugins(client)

  render(
    <DriveProvider
      client={client}
      lang={data.cozyLocale}
      dictRequire={lang => require(`drive/locales/${lang}`)}
    >
      <IntentHandler intentId={intent} />
    </DriveProvider>,
    root
  )
})
