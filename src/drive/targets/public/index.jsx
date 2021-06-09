/* global cozy */

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'

import 'cozy-ui/transpiled/react/stylesheet.css'

import { Router, Route, Redirect, hashHistory } from 'react-router'
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
import appMetadata from 'drive/appMetadata'
import logger from 'lib/logger'
import App from 'components/App/App'
import ExternalRedirect from 'drive/web/modules/navigation/ExternalRedirect'
import StyledApp from 'drive/web/modules/drive/StyledApp'
import { isOnlyOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'

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
  const {
    sharecode,
    isOnlyOfficeDocShared,
    onlyOfficeDocId,
    username
  } = getQueryParameter()

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
      initCozyBar(dataset)
      render(
        <App lang={lang} polyglot={polyglot} client={client} store={store}>
          {isFile ? (
            <Router history={hashHistory}>
              <Route component={PublicLayout}>
                {isOnlyOfficeEnabled() && (
                  <>
                    <Route
                      path="onlyoffice/:fileId"
                      component={props => (
                        <OnlyOfficeView
                          {...props}
                          isPublic={true}
                          username={username}
                          isFromSharing={isOnlyOfficeDocShared}
                        />
                      )}
                    />
                    {models.file.shouldBeOpenedByOnlyOffice(data) && (
                      <Redirect from="/" to={`onlyoffice/${data.id}`} />
                    )}
                  </>
                )}
                <Route
                  path="/"
                  component={() => <LightFileViewer files={[data]} />}
                />
              </Route>
            </Router>
          ) : (
            <Router history={hashHistory}>
              <Route component={PublicLayout}>
                <Redirect from="/files/:folderId" to="/folder/:folderId" />
                <Route path="folder(/:folderId)" component={PublicFolderView}>
                  <Route path="file/:fileId/revision" component={FileHistory} />
                </Route>
                {isOnlyOfficeEnabled() && (
                  // Used to open an only office file inside a shared folder
                  <Route
                    path="onlyoffice/:fileId"
                    component={props => (
                      <OnlyOfficeView
                        {...props}
                        isPublic={true}
                        isInSharedFolder={true}
                      />
                    )}
                  />
                )}
              </Route>
              <Route path="external/:fileId" component={ExternalRedirect} />
              <Redirect from="/*" to={`folder/${sharedDocumentId}`} />
            </Router>
          )}
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
