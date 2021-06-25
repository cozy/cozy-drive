/* global cozy */
import CozyClient, { StackLink } from 'cozy-client'
import PouchLink from 'cozy-pouch-link'
import { isMobileApp, isIOSApp, getDeviceName } from 'cozy-device-helper'
import { SOFTWARE_ID, SOFTWARE_NAME } from './constants'
import { disableBackgroundService } from './background'
import { schema, DOCTYPE_FILES } from 'drive/lib/doctypes'
import appMetadata from 'drive/appMetadata'
import { getRedirectUri } from 'drive/mobile/lib/redirect'
import {
  buildRecentQuery,
  buildDriveQuery,
  buildFolderQuery
} from 'drive/web/modules/queries'
import { ONBOARDED_ITEM } from 'drive/mobile/modules/onboarding/OnBoarding'
import localForage from 'localforage'

export const getLang = () =>
  navigator && navigator.language ? navigator.language.slice(0, 2) : 'en'

export const getOauthOptions = () => {
  return {
    redirectURI: getRedirectUri(appMetadata.slug),
    softwareID: SOFTWARE_ID,
    clientName: `${SOFTWARE_NAME} (${getDeviceName()})`,
    softwareVersion: appMetadata.version,
    clientKind: 'mobile',
    clientURI: 'https://github.com/cozy/cozy-drive/',
    logoURI:
      'https://github.com/cozy/cozy-drive/raw/master/targets/drive/vendor/assets/oauth-app-icon.png',
    policyURI: 'https://files.cozycloud.cc/cgu.pdf'
  }
}

export const getOldAdapterName = () => {
  return isMobileApp() && isIOSApp() ? 'cordova-sqlite' : 'idb'
}

export const getAdapterPlugin = adapterName => {
  if (adapterName === 'cordova-sqlite') {
    return require('pouchdb-adapter-cordova-sqlite')
  }
  if (adapterName === 'idb') {
    return require('pouchdb-adapter-idb')
  }
  return require('pouchdb-adapter-indexeddb').default
}

export const shouldMigrateAdapter = async () => {
  const alreadyOnboarded = await localForage.getItem(ONBOARDED_ITEM)
  const adapterName = window.localStorage.getItem(
    'cozy-client-pouch-link-adaptername'
  )
  return alreadyOnboarded && adapterName !== 'indexeddb'
}

export const pickAdapter = async () => {
  const alreadyOnboarded = await localForage.getItem(ONBOARDED_ITEM)
  if (!alreadyOnboarded) {
    // The user is not onboarded: there is no data to migrate
    return 'indexeddb'
  }
  const adapterName = window.localStorage.getItem(
    'cozy-client-pouch-link-adaptername'
  )
  if (alreadyOnboarded && !adapterName) {
    // The adapter is not set yet: an old adapter was used
    return getOldAdapterName()
  }
  if (adapterName !== 'indexeddb') {
    return getOldAdapterName()
  }
  return 'indexeddb'
}

export const initClient = async url => {
  const stackLink = new StackLink()
  const adapter = await pickAdapter()

  const pouchLinkOptions = {
    doctypes: [DOCTYPE_FILES],
    doctypesReplicationOptions: {
      [DOCTYPE_FILES]: {
        strategy: 'fromRemote',
        warmupQueries: [
          buildDriveQuery({
            currentFolderId: 'io.cozy.files.root-dir',
            type: 'directory',
            sortAttribute: 'name',
            sortOrder: 'asc'
          }),
          buildRecentQuery(),
          buildFolderQuery('io.cozy.files.root-dir')
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

  if (isMobileApp() && isIOSApp()) {
    pouchLinkOptions.pouch = {
      plugins: [getAdapterPlugin(adapter)],
      options: {
        adapter,
        location: 'default'
      }
    }
  }

  const pouchLink = new PouchLink(pouchLinkOptions)

  return new CozyClient({
    uri: url,
    oauth: getOauthOptions(),
    appMetadata,
    schema,
    links: [pouchLink, stackLink],
    store: false
  })
}

export const initBar = async client => {
  // Prevents the bar to be initialized 2 times in a row after the onboarding
  if (document.getElementById('coz-bar')) {
    return
  }
  await cozy.bar.init({
    appName: 'Drive',
    appNamePrefix: 'Cozy',
    appSlug: 'drive',
    cozyClient: client,
    iconPath: require('../../targets/vendor/assets/app-icon.svg'),
    lang: getLang(),
    cozyURL: client.uri,
    replaceTitleOnMobile: false,
    displayOnMobile: true
  })
}

export function resetClient(client) {
  // reset cozy-bar
  if (document.getElementById('coz-bar')) {
    document.getElementById('coz-bar').remove()
  }
  // reset cozy-client
  client.getStackClient().resetClient()

  disableBackgroundService()
}
