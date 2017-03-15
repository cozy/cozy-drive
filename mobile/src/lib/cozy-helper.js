/* global cozy, document */

import { LocalStorage as Storage } from 'cozy-client-js'

import { openFolder } from '../../../src/actions'
import { revokeClient } from '../actions/authorization'

const clientRevokedMsg = 'Client has been revoked'
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
  if (url) {
    console.log(`Cozy Client initializes a connection with ${url}`)
    cozy.client.init({
      cozyURL: url,
      oauth: getAuth(onRegister, device)
    })
  }
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

export function refreshFolder (dispatch, getState) {
  return result => {
    if (result.docs_written !== 0) {
      dispatch(openFolder(getState().folder.id))
    }
  }
}

export const onError = (dispatch, getState) => (err) => {
  if (err.message === clientRevokedMsg) {
    console.warn(`Your device is no more connected to your server: ${getState().mobile.settings.serverUrl}`)
    dispatch(revokeClient())
  } else if (err.message === 'ETIMEDOUT' || err.message === 'getCheckpoint rejected with ') {
    console.log('timeout')
  } else {
    console.warn(err)
  }
}
