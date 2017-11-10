/* global cozy, document, __APP_VERSION__, __ALLOW_HTTP__ */
import { getLang } from './init'
import { LocalStorage as Storage } from 'cozy-client-js'
import { SOFTWARE_NAME, SOFTWARE_ID } from './constants'

export const clientRevokedMsg = 'Client has been revoked'
const getStorage = () => new Storage()
const getClientName = device => `${SOFTWARE_NAME} (${device})`

const getClientParams = device => ({
  redirectURI: 'http://localhost',
  softwareID: SOFTWARE_ID,
  clientName: getClientName(device),
  softwareVersion: __APP_VERSION__,
  clientKind: 'mobile',
  clientURI: 'https://github.com/cozy/cozy-drive/',
  logoURI:
    'https://github.com/cozy/cozy-drive/raw/master/targets/drive/vendor/assets/oauth-app-icon.png',
  policyURI: 'https://files.cozycloud.cc/cgu.pdf',
  scopes: [
    'io.cozy.files',
    'io.cozy.contacts',
    'io.cozy.jobs:POST:sendmail:worker'
  ]
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
      offline: { doctypes: ['io.cozy.files'] }
    })
  }
}

export const initBar = () => {
  cozy.bar.init({
    appName: 'Drive',
    appEditor: 'Cozy',
    iconPath: require('../../../../targets/drive/vendor/assets/app-icon.svg'),
    lang: getLang(),
    replaceTitleOnMobile: true
  })
}

export const isClientRegistered = async client => {
  return cozy.client.auth
    .getClient(client)
    .then(client => true)
    .catch(err => {
      if (err.message === clientRevokedMsg) {
        return false
      }
      // this is the error sent if we are offline
      if (err.message === 'Failed to fetch') {
        return true
      }
    })
}

export function resetClient() {
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

export const MAIL_EXCEPTION = 'MAIL_EXCEPTION'
export const SCHEME_EXCEPTION = 'SCHEME_EXCEPTION'

class SchemeError extends Error {
  constructor(message) {
    super(message)
    this.name = SCHEME_EXCEPTION
  }
}

class MailError extends Error {
  constructor(message) {
    super(message)
    this.name = MAIL_EXCEPTION
  }
}

export const checkURL = url => {
  if (url.indexOf('@') > -1) {
    throw new MailError('You typed an email address.')
  }

  let scheme = 'https://'
  if (__ALLOW_HTTP__) {
    if (!url.startsWith(scheme)) {
      scheme = 'http://'
    }
    console.warn("development mode: we don't check SSL requirement")
  }
  if (/(.*):\/\/(.*)/.test(url) && !url.startsWith(scheme)) {
    if (__ALLOW_HTTP__) {
      throw new SchemeError(
        `The supported protocols are http:// or https:// (development mode)`
      )
    }
    throw new SchemeError(`The only supported protocol is ${scheme}`)
  }
  if (!url.startsWith(scheme)) {
    url = `${scheme}${url}`
  }
  return url
}

export const getToken = async () => {
  const credentials = await cozy.client.authorize()
  return credentials.token.accessToken
}

export const getClientUrl = () => cozy.client._url
