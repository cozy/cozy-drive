/* global cozy */

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'

import 'cozy-ui/transpiled/react/stylesheet.css'

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import PublicLayout from 'drive/web/modules/public/PublicLayout'
import PublicFolderView from 'drive/web/modules/views/Public'
import LightFileViewer from 'drive/web/modules/public/LightFileViewer'
import FileHistory from 'components/FileHistory'
import ErrorShare from 'components/Error/ErrorShare'
import OnlyOfficeView from 'drive/web/modules/views/OnlyOffice'
import OnlyOfficeCreateView from 'drive/web/modules/views/OnlyOffice/Create'
import { isOnlyOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import appMetadata from 'drive/appMetadata'
import logger from 'lib/logger'
import App from 'components/App/App'
import ExternalRedirect from 'drive/web/modules/navigation/ExternalRedirect'
import StyledApp from 'drive/web/modules/drive/StyledApp'
import cozyBar from 'lib/cozyBar'

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
        <ErrorShare errorType={`public_unshared`} />
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
    const sharedDocumentId = await getSharedDocument(client)

    // In the case of a shared folder, we want to get the id of the only office file,
    // not the id of the shared document (that is the folder)
    const { data } = await client
      .collection('io.cozy.files')
      .get(isOnlyOfficeDocShared ? onlyOfficeDocId : sharedDocumentId)

    const isFile = data && data.type === 'file'
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
            <Routes>
              <Route element={<PublicLayout />}>
                {isOnlyOfficeEnabled() && (
                  <>
                    <Route
                      path="onlyoffice/:fileId"
                      element={
                        <OnlyOfficeView
                          isPublic={true}
                          username={username}
                          isFromSharing={isOnlyOfficeDocShared}
                          isInSharedFolder={!isFile}
                        />
                      }
                    />
                    <Route
                      path="onlyoffice/:fileId/fromCreate"
                      element={
                        <OnlyOfficeView
                          isPublic={true}
                          isInSharedFolder={!isFile}
                        />
                      }
                    />
                    <Route
                      path="onlyoffice/create/:folderId/:fileClass"
                      element={<OnlyOfficeCreateView />}
                    />
                    {models.file.shouldBeOpenedByOnlyOffice(data) && (
                      <Route
                        path="/"
                        element={<Navigate to={`onlyoffice/${data.id}`} />}
                      />
                    )}
                  </>
                )}

                {isFile && (
                  <Route
                    path="/"
                    element={<LightFileViewer files={[data]} />}
                  />
                )}

                {!isFile && (
                  <>
                    <Route
                      path="/files/:folderId"
                      element={<Navigate to="/folder/:folderId" />}
                    />
                    <Route path="folder" element={<PublicFolderView />}>
                      <Route
                        path="file/:fileId/revision"
                        element={<FileHistory />}
                      />
                    </Route>
                    <Route
                      path="folder/:folderId"
                      element={<PublicFolderView />}
                    >
                      <Route
                        path="file/:fileId/revision"
                        element={<FileHistory />}
                      />
                    </Route>

                    <Route
                      path="external/:fileId"
                      element={<ExternalRedirect />}
                    />
                    <Route
                      path="/*"
                      element={<Navigate to={`folder/${sharedDocumentId}`} />}
                    />
                  </>
                )}
              </Route>
            </Routes>
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
