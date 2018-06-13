/* global cozy __DEVELOPMENT__ */
import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n, initTranslation } from 'cozy-ui/react/I18n'

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
    uri: cozyUrl,
    token: sharecode
  })

  let useDirectDownload

  if (directdownload !== undefined) useDirectDownload = true
  else {
    try {
      const response = await client.collection('io.cozy.files').get(id)
      const { data } = response
      const isFile = data && data.type === 'file'
      useDirectDownload = isFile
    } catch (e) {
      console.warn(e)
      useDirectDownload = false
    }
  }

  if (useDirectDownload) {
    client
      .collection('io.cozy.files')
      .getDownloadLinkById(id)
      .then(link => {
        window.location = link
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

    // we still need cozy-client-js for opening a folder
    cozy.client.init({
      cozyURL: cozyUrl,
      token: sharecode
    })

    const polyglot = initTranslation(data.cozyLocale, lang =>
      require(`drive/locales/${lang}`)
    )

    const store = configureStore(client, polyglot.t.bind(polyglot))

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
      <I18n lang={lang} polyglot={polyglot}>
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
