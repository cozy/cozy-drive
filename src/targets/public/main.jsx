/* global cozy */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import { I18n } from 'cozy-ui/react/I18n'

import configureStore from '../..//store/configureStore'
import Layout from '../../components/Layout'

import LightFolderView from '../../components/LightFolderView'

document.addEventListener('DOMContentLoaded', init)

const arrToObj = (obj = {}, [key, val = true]) => {
  obj[key] = val
  return obj
}

const getQueryParameter = () => window
  .location
  .search
  .substring(1)
  .split('&')
  .map(varval => varval.split('='))
  .reduce(arrToObj, {})

function init () {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const { id, sharecode, directdownload } = getQueryParameter()

  if (data.cozyDomain) {
    cozy.client.init({
      cozyURL: `//${data.cozyDomain}`,
      token: sharecode
    })
  }

  if (directdownload) {
    cozy.client.files.getDownloadLinkById(id).then(
      link => window.open(`${cozy.client._url}${link}`, '_SELF')
    )
  } else {
    const store = configureStore()

    if (data.cozyAppName && data.cozyAppEditor && data.cozyIconPath && data.cozyLocale) {
      cozy.bar.init({
        appName: data.cozyAppName,
        appEditor: data.cozyAppEditor,
        iconPath: data.cozyIconPath,
        lang: data.cozyLocale,
        replaceTitleOnMobile: true
      })
    }

    render(
      <I18n lang={lang} dictRequire={(lang) => require(`../../locales/${lang}`)}>
        <Provider store={store}>
          <Router history={hashHistory}>
            <Route component={Layout}>
              <Route path='files(/:folderId)' component={LightFolderView} />
            </Route>
            <Redirect from='/*' to={`files/${id}`} />
          </Router>
        </Provider>
      </I18n>,
      root
    )
  }
}
