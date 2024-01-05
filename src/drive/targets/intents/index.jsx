/* global cozy */

import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'whatwg-fetch'

import React from 'react'
import { render } from 'react-dom'

import { getQueryParameter } from 'react-cozy-helpers'
import CozyClient from 'cozy-client'

import DriveProvider from 'lib/DriveProvider'
import registerClientPlugins from 'lib/registerClientPlugins'
import { schema } from 'lib/doctypes'
import appMetadata from 'lib/appMetadata'
import IntentHandler from 'drive/web/modules/services'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('main')
  const data = JSON.parse(root.dataset.cozy)

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`

  const { intent } = getQueryParameter()

  const client = new CozyClient({
    uri: cozyUrl,
    token: data.token,
    appMetadata,
    schema
  })

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.token
  })
  registerClientPlugins(client)

  render(
    <DriveProvider
      client={client}
      lang={data.locale}
      dictRequire={lang => require(`locales/${lang}`)}
    >
      <IntentHandler intentId={intent} />
    </DriveProvider>,
    root
  )
})
