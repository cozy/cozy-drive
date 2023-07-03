/* global cozy */

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import 'cozy-ui/transpiled/react/stylesheet.css'

import { getQueryParameter } from 'react-cozy-helpers'
import CozyClient, { models } from 'cozy-client'
import { Document } from 'cozy-doctypes'
import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import getSharedDocument from 'cozy-sharing/dist/getSharedDocument'

import registerClientPlugins from 'drive/lib/registerClientPlugins'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import { schema } from 'drive/lib/doctypes'
import configureStore from 'drive/store/configureStore'
import ErrorShare from 'components/Error/ErrorShare'
import appMetadata from 'drive/appMetadata'
import logger from 'lib/logger'
import App from 'components/App/App'
import StyledApp from 'drive/web/modules/drive/StyledApp'
import cozyBar from 'lib/cozyBar'
import AppRouter from 'drive/targets/public/components/AppRouter'
import styles from 'drive/styles/main.styl'

const initCozyBar = (data, client) => {
  if (data.app.name && data.app.editor && data.app.icon && data.locale) {
    cozyBar.init({
      appName: data.app.name,
      appEditor: data.app.editor,
      cozyClient: client,
      iconPath: data.app.icon,
      lang: data.locale,
      replaceTitleOnMobile: true,
      isPublic: true,
      appSlug: data.app.slug,
      appNamePrefix: data.app.prefix
    })
  }
}

const renderError = (lang, root) =>
  render(
    <I18n lang={lang} dictRequire={lang => require(`drive/locales/${lang}`)}>
      <StyledApp>
        <main className={styles['center-layout']}>
          <ErrorShare errorType={`public_unshared`} />
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
    require(`drive/locales/${lang}`)
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
        window.location.href = await models.note.fetchURL(client, data)
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else {
      initCozyBar(dataset, client)
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
    initCozyBar(dataset, client)
    renderError(lang, root)
  }
}

document.addEventListener('DOMContentLoaded', init)
