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
import { WebVaultClient } from 'cozy-keys-lib'

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

  const vaultClient = new WebVaultClient(cozyUrl)

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.token
  })
  registerClientPlugins(client)

  render(
    <DriveProvider
      client={client}
      vaultClient={vaultClient}
      lang={data.locale}
      dictRequire={lang => require(`drive/locales/${lang}`)}
    >
      <IntentHandler intentId={intent} />
    </DriveProvider>,
    root
  )
})
