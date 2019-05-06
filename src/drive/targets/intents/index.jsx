/* global cozy */

import 'whatwg-fetch'
import 'cozy-ui/transpiled/react/stylesheet.css'

import React from 'react'
import { render } from 'react-dom'
import IntentHandler from 'drive/web/modules/services'
import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/react/I18n'
import { getQueryParameter } from 'react-cozy-helpers'
import appMetadata from 'drive/appMetadata'
import { schema } from 'drive/lib/doctypes'

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
