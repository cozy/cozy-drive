/* global cozy */

// cozy-ui css import should be done before any other import
// otherwise the themes will not be supplied and the app crashes
// eslint-disable-next-line import/order
import 'cozy-ui/dist/cozy-ui.min.css'
// eslint-disable-next-line import/order
import 'cozy-ui/transpiled/react/stylesheet.css'

import React from 'react'
import { getQueryParameter } from 'react-cozy-helpers'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import configureStore from 'store/configureStore'
import 'whatwg-fetch'

import CozyClient, { models } from 'cozy-client'
import { Document } from 'cozy-doctypes'
import getSharedDocument from 'cozy-sharing/dist/getSharedDocument'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { I18n, initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

import AppRouter from './components/AppRouter'
import App from 'components/App/App'
import ErrorShare from 'components/Error/ErrorShare'
import appMetadata from 'lib/appMetadata'
import { schema } from 'lib/doctypes'
import logger from 'lib/logger'
import registerClientPlugins from 'lib/registerClientPlugins'
import { configureReporter, setCozyUrl } from 'lib/reporter'
import StyledApp from 'modules/drive/StyledApp'

import styles from 'styles/main.styl'

const renderError = (lang, root) =>
  render(
    <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
      <StyledApp>
        <main className={styles['center-layout']}>
          <ErrorShare errorType="public_unshared" />
        </main>
      </StyledApp>
    </I18n>,
    root
  )

const init = async () => {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const dataset = JSON.parse(root.dataset.cozy)
  const { sharecode, isOnlyOfficeDocShared, onlyOfficeDocId, username } =
    getQueryParameter()

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${dataset.domain}`

  const client = new CozyClient({
    uri: cozyUrl,
    token: sharecode,
    appMetadata,
    schema,
    store: false
  })
  registerClientPlugins(client)

  if (!Document.cozyClient) {
    Document.registerClient(client)
  }
  configureReporter()
  setCozyUrl(cozyUrl)
  // we still need cozy-client-js for opening a folder
  cozy.client.init({
    cozyURL: cozyUrl,
    token: sharecode
  })
  const polyglot = initTranslation(dataset.locale, lang =>
    require(`locales/${lang}`)
  )

  const store = configureStore({
    client,
    t: polyglot.t.bind(polyglot)
  })

  try {
    const { id: sharedDocumentId, isReadOnly } = await getSharedDocument(client)

    // In the case of a shared folder, we want to get the id of the only office file,
    // not the id of the shared document (that is the folder)
    const { data } = await client
      .collection('io.cozy.files')
      .get(isOnlyOfficeDocShared ? onlyOfficeDocId : sharedDocumentId)

    const isNote = models.file.isNote(data)

    if (isNote) {
      try {
        window.location.href = await models.note.fetchURL(client, data, {
          pathname: `${location.pathname}${
            location.pathname.endsWith('/') ? '' : '/'
          }`
        })
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else {
      render(
        <App lang={lang} polyglot={polyglot} client={client} store={store}>
          <HashRouter>
            <AppRouter
              isReadOnly={isReadOnly}
              username={username}
              data={data}
              isOnlyOfficeDocShared={isOnlyOfficeDocShared}
              sharedDocumentId={sharedDocumentId}
            />
          </HashRouter>
        </App>,
        root
      )
    }
  } catch (e) {
    logger.warn(e)
    renderError(lang, root)
  }
}

document.addEventListener('DOMContentLoaded', init)
