/* global cozy, document */
import { LocalStorage as Storage } from 'cozy-client-js'
import CozyClient from 'cozy-client'
import { SOFTWARE_ID, SOFTWARE_NAME } from './constants'
import { disableBackgroundService } from './background'
import { schema, DOCTYPE_FILES } from 'drive/lib/doctypes'
export const getLang = () =>
  navigator && navigator.language ? navigator.language.slice(0, 2) : 'en'
import { isMobileApp, getDeviceName } from 'cozy-device-helper'
import appMetadata from 'drive/appMetadata'

export const getOauthOptions = () => {
  return {
    redirectURI: isMobileApp() ? 'cozydrive://auth' : 'http://localhost',
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

export const permissions = [
  'io.cozy.files',
  'io.cozy.apps:GET',
  'io.cozy.settings:GET',
  'io.cozy.contacts',
  'io.cozy.contacts.groups',
  'io.cozy.jobs:POST:sendmail:worker'
]

export const initClient = url => {
  return new CozyClient({
    uri: url,
    scope: permissions,
    oauth: getOauthOptions(),
    offline: { doctypes: [DOCTYPE_FILES] },
    appMetadata,
    schema
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
    cozyURL: client.options.uri,
    token: await getTokenWithNoException(),
    renewToken: () => client.getClient().refreshToken(),
    replaceTitleOnMobile: false,
    displayOnMobile: true
  })
}

export const restoreCozyClientJs = (uri, clientInfos, token) => {
  const offline = { doctypes: ['io.cozy.files'] }
  cozy.client.init({
    cozyURL: uri,
    oauth: {
      storage: new Storage(),
      clientParams: {
        ...clientInfos,
        scopes: token.scope
      }
    },
    offline
  })
  const realToken = new cozy.client.auth.AccessToken(token)
  cozy.client.saveCredentials(clientInfos, realToken)
}

export function resetClient(client, clientInfo = null) {
  if (clientInfo && cozy.client.auth.unregisterClient) {
    cozy.client.auth.unregisterClient(clientInfo)
  }
  // reset cozy-bar
  if (document.getElementById('coz-bar')) {
    document.getElementById('coz-bar').remove()
  }
  // reset pouchDB
  if (cozy.client.offline.destroyAllDatabase) {
    cozy.client.offline.destroyAllDatabase()
  }
  // reset cozy-client
  client.getStackClient().resetClient()
  // reset cozy-client-js
  if (cozy.client._storage) {
    cozy.client._storage.clear()
  }

  disableBackgroundService()
}

export const getToken = async () => {
  const credentials = await cozy.client.authorize()
  return credentials.token.accessToken
}

const getTokenWithNoException = async () => {
  try {
    return await getToken()
  } catch (_) {
    return null
  }
}

export const getClientUrl = () => cozy.client._url
