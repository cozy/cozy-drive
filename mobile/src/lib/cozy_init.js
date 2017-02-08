import cozy, { LocalStorage as Storage } from 'cozy-client-js'

const getStorage = () => new Storage()
const getClientName = () => 'Mobile Cozy Files'

const getClientParams = () => ({
  redirectURI: 'http://localhost',
  softwareID: 'io.cozy.mobile.files',
  clientName: getClientName(),
  scopes: ['io.cozy.files:GET']
})

const getAuth = (onRegister) => ({
  storage: getStorage(),
  clientParams: getClientParams(),
  onRegistered: onRegister
})

export const init = (url, onRegister) => {
  console.log(`Cozy Client initializes a connection with ${url}`)
  cozy.init({
    cozyURL: url,
    offline: {doctypes: ['io.cozy.files'], timer: 15},
    oauth: getAuth(onRegister)
  })
}
