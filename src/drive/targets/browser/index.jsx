/* global cozy */

import 'drive/styles/main'

import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { I18n, initTranslation } from 'cozy-ui/react/I18n'
import CozyClient, { CozyProvider } from 'cozy-client'
import { shouldEnableTracking, getTracker } from 'cozy-ui/react/helpers/tracker'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'

import AppRoute from 'drive/web/modules/navigation/AppRoute'
import configureStore from 'drive/store/configureStore'
import { schema } from 'drive/lib/doctypes'
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.cozyDomain}`

  configureReporter()
  setCozyUrl(cozyUrl)
  const client = new CozyClient({
    uri: cozyUrl,
    token: data.cozyToken,
    schema
  })

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.cozyToken
  })

  cozy.bar.init({
    appName: data.cozyAppName,
    appEditor: data.cozyAppEditor,
    cozyClient: client,
    iconPath: data.cozyIconPath,
    lang: data.cozyLocale,
    replaceTitleOnMobile: false
  })

  let history = hashHistory
  if (shouldEnableTracking() && getTracker()) {
    let trackerInstance = getTracker()
    history = trackerInstance.connectToHistory(hashHistory)
    trackerInstance.track(hashHistory.getCurrentLocation()) // when using a hash history, the initial visit is not tracked by piwik react router
  }

  const polyglot = initTranslation(data.cozyLocale, lang =>
    require(`drive/locales/${lang}`)
  )

  const store = configureStore(client, polyglot.t.bind(polyglot))

  render(
    <I18n lang={data.cozyLocale} polyglot={polyglot}>
      <CozyProvider store={store} client={client}>
        <Router history={history} routes={AppRoute} />
      </CozyProvider>
    </I18n>,
    root
  )
})
