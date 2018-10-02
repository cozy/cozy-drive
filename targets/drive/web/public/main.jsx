/* global cozy __DEVELOPMENT__ */
import 'babel-polyfill'

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n, initTranslation } from 'cozy-ui/react/I18n'
import { getQueryParameter } from 'react-cozy-helpers'
import { schema } from '../../doctypes'
import configureStore from 'drive/store/configureStore'
import PublicLayout from 'drive/web/modules/public/PublicLayout'
import LightFolderView from 'drive/web/modules/public/LightFolderView'
import LightFileViewer from 'drive/web/modules/public/LightFileViewer'
import ErrorShare from 'components/Error/ErrorShare'

const getDocumentId = async client => {
  const isPreviewingSharing = window.location.toString().includes('/preview')

  if (isPreviewingSharing) {
    const response = await client
      .collection('io.cozy.permissions')
      .getOwnPermissions()

    const permissions = response.data.attributes.permissions
    const sharingId = Object.values(permissions)[0]['values'][0]
    return sharingId
  } else {
    const { id } = getQueryParameter()
    return id
  }
}

const initCozyBar = data => {
  if (
    data.cozyAppName &&
    data.cozyAppEditor &&
    data.cozyIconPath &&
    data.cozyLocale
  ) {
    cozy.bar.init({
      appName: data.cozyAppName,
      appEditor: data.cozyAppEditor,
      iconPath: data.cozyIconPath,
      lang: data.cozyLocale,
      replaceTitleOnMobile: true
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
    schema
  })

  if (__DEVELOPMENT__) {
    // Enables React dev tools for Preact
    // Cannot use import as we are in a condition
    require('preact/devtools')

    // Export React to window for the devtools
    window.React = React
  }

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
    const id = await getDocumentId(client)

    const response = await client.collection('io.cozy.files').get(id)
    const { data } = response
    const isFile = data && data.type === 'file'
    initCozyBar(dataset)
    render(
      <I18n lang={lang} polyglot={polyglot}>
        <CozyProvider store={store} client={client}>
          {isFile ? (
            <LightFileViewer files={[data]} />
          ) : (
            <Router history={hashHistory}>
              <Route component={PublicLayout}>
                <Route path="files(/:folderId)" component={LightFolderView} />
              </Route>
              <Redirect from="/*" to={`files/${id}`} />
            </Router>
          )}
        </CozyProvider>
      </I18n>,
      root
    )
  } catch (e) {
    console.warn(e)
    initCozyBar(dataset)
    renderError(lang, root)
  }
}

document.addEventListener('DOMContentLoaded', init)
