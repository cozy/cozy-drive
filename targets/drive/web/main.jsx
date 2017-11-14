/* global __DEVELOPMENT__, cozy */

import 'babel-polyfill'

import 'drive/styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { I18n } from 'cozy-ui/react/I18n'
import { CozyClient, CozyProvider } from 'cozy-client'
import { shouldEnableTracking, getTracker } from 'cozy-ui/react/helpers/tracker'

import AppRoute from 'drive/components/AppRoute'
import configureStore from 'drive/store/configureStore'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  const client = new CozyClient({
    cozyURL: `//${data.cozyDomain}`,
    token: data.cozyToken
  })

  cozy.bar.init({
    appName: data.cozyAppName,
    appEditor: data.cozyAppEditor,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: true
  })

  let history = hashHistory
  if (shouldEnableTracking() && getTracker()) {
    let trackerInstance = getTracker()
    history = trackerInstance.connectToHistory(hashHistory)
    trackerInstance.track(hashHistory.getCurrentLocation()) // when using a hash history, the initial visit is not tracked by piwik react router
  }

  const store = configureStore(client)

  render((
    <I18n lang={data.cozyLocale} dictRequire={(lang) => require(`drive/locales/${lang}`)}>
      <CozyProvider store={store} client={client}>
        <Router history={history} routes={AppRoute} />
      </CozyProvider>
    </I18n>
  ), root)
})
