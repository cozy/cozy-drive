/* global cozy */

import memoize from 'lodash/memoize'
import configureStore from 'store/configureStore'

import CozyClient from 'cozy-client'
import { Document } from 'cozy-doctypes'
import { initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

import appMetadata from 'lib/appMetadata'
import { schema } from 'lib/doctypes'
import registerClientPlugins from 'lib/registerClientPlugins'
import { configureReporter, setCozyUrl } from 'lib/reporter'

const setupApp = memoize(() => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`

  configureReporter()
  setCozyUrl(cozyUrl)
  const client = new CozyClient({
    uri: cozyUrl,
    token: data.token,
    appMetadata,
    schema,
    store: false
  })

  if (!Document.cozyClient) {
    Document.registerClient(client)
  }
  const locale = data.locale
  registerClientPlugins(client)
  const polyglot = initTranslation(locale, lang => require(`locales/${lang}`))

  const store = configureStore({
    client,
    t: polyglot.t.bind(polyglot)
  })

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.token
  })

  return { locale, polyglot, client, store, root }
})

export default setupApp
