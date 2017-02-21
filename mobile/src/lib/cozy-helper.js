import cozy, { LocalStorage as Storage } from 'cozy-client-js'

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

export const init = (url, onRegister = null, device = 'Device') => {
  console.log(`Cozy Client initializes a connection with ${url}`)
  cozy.init({
    cozyURL: url,
    offline: {doctypes: ['io.cozy.files'], timer: 15},
    oauth: getAuth(onRegister, device)
  })
}
