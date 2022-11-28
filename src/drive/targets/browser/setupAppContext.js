/* global cozy */

import memoize from 'lodash/memoize'
import { initTranslation } from 'cozy-ui/transpiled/react/I18n'
import CozyClient from 'cozy-client'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import registerClientPlugins from 'drive/lib/registerClientPlugins'

import appMetadata from 'drive/appMetadata'
import configureStore from 'drive/store/configureStore'
import { schema } from 'drive/lib/doctypes'
import { Document } from 'cozy-doctypes'
import { hashHistory } from 'react-router'

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
  const polyglot = initTranslation(locale, lang =>
    require(`drive/locales/${lang}`)
  )
  let history = hashHistory

  const store = configureStore({
    client,
    t: polyglot.t.bind(polyglot),
    history
  })

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.token
  })

  cozy.bar.init({
    appName: data.app.name,
    appEditor: data.app.editor,
    cozyClient: client,
    iconPath: data.app.icon,
    lang: data.locale,
    replaceTitleOnMobile: false,
    appSlug: data.app.slug,
    appNamePrefix: data.app.prefix
  })

  return { locale, polyglot, client, history, store, root }
})

export default setupApp
