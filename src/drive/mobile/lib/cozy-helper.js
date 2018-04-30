/* global cozy, document, __APP_VERSION__, */
import { LocalStorage as Storage } from 'cozy-client-js'
import CozyClient from 'cozy-client'
import { SOFTWARE_ID, SOFTWARE_NAME } from './constants'
import { getDeviceName, isIos } from './device'
import { disableBackgroundService } from './background'

export const getLang = () =>
  navigator && navigator.language ? navigator.language.slice(0, 2) : 'en'

export const initClient = url => {
  const offline = { doctypes: ['io.cozy.files'] }
  if (isIos()) offline.options = { adapter: 'cordova-sqlite' }

  return new CozyClient({
    uri: url,
    scope: [
      'io.cozy.files',
      'io.cozy.apps:GET',
      'io.cozy.jobs:POST:sendmail:worker'
    ],
    oauth: {
      redirectURI: 'http://localhost',
      softwareID: SOFTWARE_ID,
      clientName: `${SOFTWARE_NAME} (${getDeviceName()})`,
      softwareVersion: __APP_VERSION__,
      clientKind: 'mobile',
      clientURI: 'https://github.com/cozy/cozy-drive/',
      logoURI:
        'https://github.com/cozy/cozy-drive/raw/master/targets/drive/vendor/assets/oauth-app-icon.png',
      policyURI: 'https://files.cozycloud.cc/cgu.pdf'
    },
    offline
  })
}

export const initBar = async client => {
  // Prevents the bar to be initialized 2 times in a row after the onboarding
  if (document.getElementById('coz-bar')) {
    return
  }

  cozy.bar.init({
    appName: 'Drive',
    appEditor: 'Cozy',
    iconPath: require('../../../../targets/drive/vendor/assets/app-icon.svg'),
    lang: getLang(),
    cozyURL: client.options.uri,
    token: await getTokenWithNoException(),
    renewToken: () => client.getOrCreateStackClient().refreshToken(),
    replaceTitleOnMobile: false,
    displayOnMobile: true
  })
}

export const restoreCozyClientJs = (uri, clientInfos, token) => {
  cozy.client.init({
    cozyURL: uri,
    oauth: {
      storage: new Storage(),
      clientParams: {
        ...clientInfos,
        scopes: token.scope
      }
    }
  })

  cozy.client.saveCredentials(clientInfos, token)

  return cozy.client.auth.getClient(clientInfos)
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
  client.getOrCreateStackClient().resetClientId()
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
