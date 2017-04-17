/* global cozy, document, __APP_VERSION__ */

import { LocalStorage as Storage } from 'cozy-client-js'

export const clientRevokedMsg = 'Client has been revoked'
const getStorage = () => new Storage()
const getClientName = device => `Cozy Drive Application on ${device} (${Math.random().toString(36).slice(2)})`

const getClientParams = (device) => ({
  redirectURI: 'http://localhost',
  softwareID: 'io.cozy.drive.mobile',
  clientName: getClientName(device),
  softwareVersion: __APP_VERSION__,
  clientKind: 'mobile',
  clientURI: 'https://github.com/cozy/cozy-drive/',
  logoURI: 'https://raw.githubusercontent.com/cozy/cozy-drive/master/vendor/assets/apple-touch-icon-120x120.png',
  policyURI: 'https://files.cozycloud.cc/cgu.pdf',
  scopes: ['io.cozy.files']
})

const getAuth = (onRegister, device) => ({
  storage: getStorage(),
  clientParams: getClientParams(device),
  onRegistered: onRegister
})

export const initClient = (url, onRegister = null, device = 'Device') => {
  if (url) {
    console.log(`Cozy Client initializes a connection with ${url}`)
    cozy.client.init({
      cozyURL: url,
      oauth: getAuth(onRegister, device),
      offline: {doctypes: ['io.cozy.files']}
    })
  }
}

export const initBar = () => {
  cozy.bar.init({
    appName: 'Cozy Drive',
    iconPath: require('../../../vendor/assets/app-icon.svg'),
    lang: 'en',
    replaceTitleOnMobile: true
  })
}

export const isClientRegistered = async (client) => {
  return await cozy.client.auth.getClient(client).then(client => true).catch(err => {
    if (err.message === clientRevokedMsg) {
      return false
    }
    // this is the error sent if we are offline
    if (err.message === 'Failed to fetch') {
      return true
    }
    throw err
  })
}

export function resetClient () {
  // reset cozy-bar
  if (document.getElementById('coz-bar')) {
    document.getElementById('coz-bar').remove()
  }
  // reset pouchDB
  if (cozy.client.offline.destroyAllDatabase) {
    cozy.client.offline.destroyAllDatabase()
  }
  // reset cozy-client-js
  if (cozy.client._storage) {
    cozy.client._storage.clear()
  }
}
