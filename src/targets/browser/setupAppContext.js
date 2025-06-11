import memoize from 'lodash/memoize'

import CozyClient from 'cozy-client'
import { Document } from 'cozy-doctypes'
import { initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

import appMetadata from '@/lib/appMetadata'
import { schema } from '@/lib/doctypes'
import registerClientPlugins from '@/lib/registerClientPlugins'
import configureStore from '@/store/configureStore'

const setupApp = memoize(() => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`

  const client = new CozyClient({
    uri: cozyUrl,
    token: data.token,
    appMetadata,
    schema,
    useCustomStore: true
  })

  if (!Document.cozyClient) {
    Document.registerClient(client)
  }
  const locale = data.locale
  registerClientPlugins(client)
  const polyglot = initTranslation(locale, lang => require(`@/locales/${lang}`))

  const store = configureStore({
    client,
    t: polyglot.t.bind(polyglot)
  })

  return { locale, polyglot, client, store, root }
})

export default setupApp
