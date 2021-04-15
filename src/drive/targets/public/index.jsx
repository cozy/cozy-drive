/* global cozy */

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'

import 'cozy-ui/transpiled/react/stylesheet.css'

import { Router, Route, Redirect, hashHistory } from 'react-router'
import { getQueryParameter } from 'react-cozy-helpers'

import SharingProvider from 'cozy-sharing'
import getSharedDocument from 'cozy-sharing/dist/getSharedDocument'
import CozyClient, { models } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import logger from 'lib/logger'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import FileHistory from 'components/FileHistory'
import ErrorShare from 'components/Error/ErrorShare'
import App from 'components/App/App'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'drive/lib/ModalContext'
import registerClientPlugins from 'drive/lib/registerClientPlugins'
import { schema } from 'drive/lib/doctypes'
import configureStore from 'drive/store/configureStore'
import PublicLayout from 'drive/web/modules/public/PublicLayout'
import LightFileViewer from 'drive/web/modules/public/LightFileViewer'
import PublicFolderView from 'drive/web/modules/views/Public'
import OnlyOfficeView from 'drive/web/modules/views/OnlyOffice'
import appMetadata from 'drive/appMetadata'
import ExternalRedirect from 'drive/web/modules/navigation/ExternalRedirect'
import StyledApp from 'drive/web/modules/drive/StyledApp'

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
      <StyledApp>
        <ErrorShare errorType={`public_unshared`} />
      </StyledApp>
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
    schema,
    store: false
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

  const store = configureStore({
    client,
    t: polyglot.t.bind(polyglot),
    history: hashHistory
  })

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
          <SharingProvider doctype="io.cozy.files" documentType="Files">
            <BreakpointsProvider>
              <ThumbnailSizeContextProvider>
                <ModalContextProvider>
                  {isFile ? (
                    <PublicLayout>
                      <LightFileViewer files={[data]} />
                    </PublicLayout>
                  ) : (
                    <Router history={hashHistory}>
                      <Route component={PublicLayout}>
                        <Redirect
                          from="/files/:folderId"
                          to="/folder/:folderId"
                        />
                        <Route
                          path="folder(/:folderId)"
                          component={PublicFolderView}
                        >
                          <Route
                            path="file/:fileId/revision"
                            component={FileHistory}
                          />
                        </Route>
                      </Route>
                      <Route
                        path="onlyoffice/:fileId"
                        component={OnlyOfficeView}
                      />
                      <Route
                        path="external/:fileId"
                        component={ExternalRedirect}
                      />
                      <Redirect from="/*" to={`folder/${sharedDocumentId}`} />
                    </Router>
                  )}
                </ModalContextProvider>
              </ThumbnailSizeContextProvider>
            </BreakpointsProvider>
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
