/* global cozy, document */

import { LocalStorage as Storage } from 'cozy-client-js'

const getStorage = () => new Storage()
const getClientName = device => `Cozy Files Application on ${device} (${Math.random().toString(36).slice(2)})`

const getClientParams = (device) => ({
  redirectURI: 'http://localhost',
  softwareID: 'io.cozy.mobile.files',
  clientName: getClientName(device),
  scopes: ['io.cozy.files']
})

const getAuth = (onRegister, device) => ({
  storage: getStorage(),
  clientParams: getClientParams(device),
  onRegistered: onRegister
})

export const initClient = (url, onRegister = null, device = 'Device') => {
  console.log(`Cozy Client initializes a connection with ${url}`)
  cozy.client.init({
    cozyURL: url,
    offline: {doctypes: ['io.cozy.files']},
    oauth: getAuth(onRegister, device)
  })
}

export const initBar = () => {
  cozy.bar.init({
    appName: 'Files',
    iconPath: require('../../../vendor/assets/app-icon.svg'),
    lang: 'en'
  })
}

export const isClientRegistered = async (client) => {
  return await cozy.client.auth.getClient(client).then(client => true).catch(err => {
    if (err.message === 'Client has been revoked') {
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
