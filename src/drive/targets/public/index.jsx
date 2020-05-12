/* global cozy */

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'

import { Router, Route, Redirect, hashHistory } from 'react-router'
import CozyClient, { models } from 'cozy-client'
import { RealtimePlugin } from 'cozy-realtime'

import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import SharingProvider from 'cozy-sharing'

import { getQueryParameter } from 'react-cozy-helpers'
import { registerClientPlugins } from 'drive/mobile/lib/cozy-helper'

import { schema } from 'drive/lib/doctypes'
import configureStore from 'drive/store/configureStore'
import PublicLayout from 'drive/web/modules/public/PublicLayout'
import LightFolderView from 'drive/web/modules/public/LightFolderView'
import LightFileViewer from 'drive/web/modules/public/LightFileViewer'
import FileHistory from 'components/FileHistory'
import ErrorShare from 'components/Error/ErrorShare'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import getSharedDocument from 'cozy-sharing/dist/getSharedDocument'
import appMetadata from 'drive/appMetadata'
import logger from 'lib/logger'

import App from 'components/App/App'
import ExternalRedirect from 'drive/web/modules/navigation/ExternalRedirect'

const initCozyBar = (data, client) => {
  if (
    data.cozyAppName &&
    data.cozyAppEditor &&
    data.cozyIconPath &&
    data.cozyLocale
  ) {
    cozy.bar.init({
      appName: data.cozyAppName,
      appEditor: data.cozyAppEditor,
      cozyClient: client,
      iconPath: data.cozyIconPath,
      lang: data.cozyLocale,
      replaceTitleOnMobile: true,
      isPublic: true
    })
  }
}

const renderError = (lang, root) =>
  render(
    <I18n lang={lang} dictRequire={lang => require(`drive/locales/${lang}`)}>
      <ErrorShare errorType={`public_unshared`} />
    </I18n>,
    root
  )

const init = async () => {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const dataset = root.dataset
  const { sharecode } = getQueryParameter()

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${dataset.cozyDomain}`

  const client = new CozyClient({
    uri: cozyUrl,
    token: sharecode,
    appMetadata,
    schema
  })
  registerClientPlugins(client)

  configureReporter()
  setCozyUrl(cozyUrl)
  // we still need cozy-client-js for opening a folder
  cozy.client.init({
    cozyURL: cozyUrl,
    token: sharecode
  })

  const polyglot = initTranslation(dataset.cozyLocale, lang =>
    require(`drive/locales/${lang}`)
  )

  const store = configureStore(client, polyglot.t.bind(polyglot))

  try {
    const sharedDocumentId = await getSharedDocument(client)

    const { data } = await client
      .collection('io.cozy.files')
      .get(sharedDocumentId)
    const isFile = data && data.type === 'file'
    const isNote = models.file.isNote(data)
    if (isNote) {
      try {
        window.location.href = await models.note.fetchURL(client, data)
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else {
      initCozyBar(dataset)
      render(
        <App lang={lang} polyglot={polyglot} client={client} store={store}>
          <SharingProvider>
            {isFile ? (
              <PublicLayout>
                <LightFileViewer files={[data]} isFile={true} />
              </PublicLayout>
            ) : (
              <Router history={hashHistory}>
                <Route component={PublicLayout}>
                  <Route path="files(/:folderId)" component={LightFolderView}>
                    <Route
                      path="file/:fileId/revision"
                      component={FileHistory}
                    />
                  </Route>
                </Route>
                <Route path="external/:fileId" component={ExternalRedirect} />
                <Redirect from="/*" to={`files/${sharedDocumentId}`} />
              </Router>
            )}
          </SharingProvider>
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
