/* global cozy */

import memoize from 'lodash/memoize'
import { initTranslation } from 'cozy-ui/transpiled/react/I18n'
import CozyClient, { StackLink } from 'cozy-client'
import {
  shouldEnableTracking,
  getTracker
} from 'cozy-ui/transpiled/react/helpers/tracker'
import { configureReporter, setCozyUrl } from 'drive/lib/reporter'
import registerClientPlugins from 'drive/lib/registerClientPlugins'

import appMetadata from 'drive/appMetadata'
import configureStore from 'drive/store/configureStore'
import { schema, DOCTYPE_FILES } from 'drive/lib/doctypes'
import { Document } from 'cozy-doctypes'
import { hashHistory } from 'react-router'
import {
  getAdapterPlugin,
  getOauthOptions,
  getOldAdapterName
} from '../../mobile/lib/cozy-helper'
import { isIOSApp, isMobileApp } from 'cozy-device-helper'
import PouchLink from 'cozy-pouch-link'

/**
 * Init Client
 *
 * @param {string} cozyUrl - Url
 * @param {string} token - token
 * @returns {CozyClient}
 */
const initClient = (cozyUrl, token) => {
  const stackLink = new StackLink()
  const adapter = getOldAdapterName()

  const pouchLinkOptions = {
    doctypes: [DOCTYPE_FILES],
    doctypesReplicationOptions: {
      [DOCTYPE_FILES]: {
        strategy: 'fromRemote',
        warmupQueries: [
          // buildDriveQuery({
          //   currentFolderId: 'io.cozy.files.root-dir',
          //   type: 'directory',
          //   sortAttribute: 'name',
          //   sortOrder: 'asc'
          // }),
          // buildRecentQuery(),
          // buildFolderQuery('io.cozy.files.root-dir')
        ]
      }
    },
    pouch: {
      plugins: [getAdapterPlugin(adapter)],
      options: {
        adapter,
        location: 'default'
      }
    },
    initialSync: true
  }

  // TODO: is it useful?
  // if (isMobileApp() && isIOSApp()) {
  //   pouchLinkOptions.pouch = {
  //     plugins: [getAdapterPlugin(adapter)],
  //     options: {
  //       adapter,
  //       location: 'default'
  //     }
  //   }
  // }

  const pouchLink = new PouchLink(pouchLinkOptions)

  return new CozyClient({
    uri: cozyUrl,
    token: token, // TODO: NEEDED? Previously used to login https://github.com/cozy/cozy-client/blob/cfeec8b59893d6083aa9b814f895be774a7f8693/packages/cozy-client/src/CozyClient.js#L219
    // oauth: getOauthOptions(), // TODO: NEW
    appMetadata,
    schema,
    links: [pouchLink, stackLink], // TODO: NEW
    store: false
  })
}

const setupApp = memoize(() => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)

  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`

  configureReporter()
  setCozyUrl(cozyUrl)
  const client = initClient(cozyUrl, data.token)

  console.log({ client })

  if (!Document.cozyClient) {
    Document.registerClient(client)
  }
  const locale = data.locale
  registerClientPlugins(client)
  const polyglot = initTranslation(locale, lang =>
    require(`drive/locales/${lang}`)
  )
  let history = hashHistory

  const store = configureStore({
    client,
    t: polyglot.t.bind(polyglot),
    history
  })

  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.token
  })

  cozy.bar.init({
    appName: data.app.name,
    appEditor: data.app.editor,
    cozyClient: client,
    iconPath: data.app.icon,
    lang: data.locale,
    replaceTitleOnMobile: false,
    appSlug: data.app.slug,
    appNamePrefix: data.app.prefix
  })

  if (shouldEnableTracking() && getTracker()) {
    let trackerInstance = getTracker()
    history = trackerInstance.connectToHistory(hashHistory)
    trackerInstance.track(hashHistory.getCurrentLocation()) // when using a hash history, the initial visit is not tracked by piwik react router
  }
  return { locale, polyglot, client, history, store, root }
})

export default setupApp
