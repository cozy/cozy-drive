/* global cozy __DEVELOPMENT__ */
import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import { CozyClient, CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/react/I18n'

import configureStore from 'drive/store/configureStore'
import PublicLayout from 'drive/components/PublicLayout'

import LightFolderView from 'drive/components/LightFolderView'
import ErrorShare from 'components/Error/ErrorShare'

const arrToObj = (obj = {}, [key, val = true]) => {
  obj[key] = val
  return obj
}

const getQueryParameter = () =>
  window.location.search
    .substring(1)
    .split('&')
    .map(varval => varval.split('='))
    .reduce(arrToObj, {})

const init = async () => {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const { id, sharecode, directdownload } = getQueryParameter()

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`

  const client = new CozyClient({
    cozyURL: cozyUrl,
    token: sharecode
  })

  let useDirectDownload

  if (directdownload !== undefined) useDirectDownload = true
  else {
    try {
      const response = await client.fetchDocument('io.cozy.files', id)
      const { data = [] } = response
      const isFile = data.length > 0 && data[0].type === 'file'
      useDirectDownload = isFile
    }
    catch (e) {
      console.warn(e)
      useDirectDownload = false
    }
  }

  if (useDirectDownload) {
    cozy.client.files
      .getDownloadLinkById(id)
      .then(link => {
        window.location = `${cozy.client._url}${link}`
      })
      .catch(e => {
        cozy.bar.init({
          appName: data.cozyAppName,
          appEditor: data.cozyAppEditor,
          iconPath: data.cozyIconPath,
          lang: data.cozyLocale,
          replaceTitleOnMobile: true
        })
        render(
          <I18n
            lang={lang}
            dictRequire={lang => require(`drive/locales/${lang}`)}
          >
            <ErrorShare errorType={`public_unshared`} />
          </I18n>,
          root
        )
      })
  } else {
    if (__DEVELOPMENT__) {
      // Enables React dev tools for Preact
      // Cannot use import as we are in a condition
      require('preact/devtools')

      // Export React to window for the devtools
      window.React = React
    }
    const store = configureStore(client)

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

    render(
      <I18n lang={lang} dictRequire={lang => require(`drive/locales/${lang}`)}>
        <CozyProvider store={store} client={client}>
          <Router history={hashHistory}>
            <Route component={PublicLayout}>
              <Route path="files(/:folderId)" component={LightFolderView} />
            </Route>
            <Redirect from="/*" to={`files/${id}`} />
          </Router>
        </CozyProvider>
      </I18n>,
      root
    )
  }
}

document.addEventListener('DOMContentLoaded', init)
