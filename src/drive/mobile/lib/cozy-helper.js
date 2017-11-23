/* global cozy, document, __APP_VERSION__, __ALLOW_HTTP__ */
import { LocalStorage as Storage } from 'cozy-client-js'
import { CozyClient } from 'cozy-client'
import { SOFTWARE_ID, SOFTWARE_NAME } from './constants'
import { getDeviceName, isIos } from './device'

export const clientRevokedMsg = 'Client has been revoked'

export const getLang = () =>
  navigator && navigator.language ? navigator.language.slice(0, 2) : 'en'

export const initClient = url => {
  const offline = { doctypes: ['io.cozy.files'] }
  if (isIos()) offline.options = { adapter: 'cordova-sqlite' }
  console.log('test')
  return new CozyClient({
    cozyURL: url,
    oauth: {
      storage: new Storage(),
      clientParams: {
        redirectURI: 'http://localhost',
        softwareID: SOFTWARE_ID,
        clientName: `${SOFTWARE_NAME} (${getDeviceName()})`,
        softwareVersion: __APP_VERSION__,
        clientKind: 'mobile',
        clientURI: 'https://github.com/cozy/cozy-drive/',
        logoURI:
          'https://github.com/cozy/cozy-drive/raw/master/targets/drive/vendor/assets/oauth-app-icon.png',
        policyURI: 'https://files.cozycloud.cc/cgu.pdf',
        scopes: [
          'io.cozy.files',
          'io.cozy.contacts',
          'io.cozy.apps:GET',
          'io.cozy.jobs:POST:sendmail:worker'
        ]
      }
    },
    offline
  })
}

export const initBar = () => {
  // Prevents the bar to be initialized 2 times in a row after the onboarding
  if (document.getElementById('coz-bar')) {
    return
  }
  cozy.bar.init({
    appName: 'Drive',
    appEditor: 'Cozy',
    iconPath: require('../../../../targets/drive/vendor/assets/app-icon.svg'),
    lang: getLang(),
    replaceTitleOnMobile: true
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
