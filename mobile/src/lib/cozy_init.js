import cozy, { LocalStorage as Storage } from 'cozy-client-js'

const getStorage = () => new Storage()
const getClientName = () => 'Mobile Cozy Files'

const getClientParams = () => ({
  redirectURI: 'http://localhost',
  softwareID: 'io.cozy.mobile.files',
  clientName: getClientName(),
  scopes: ['io.cozy.files:GET']
})

const getOnRegistered = () => {
  return (client, url) => {
    if (window.cordova && window.cordova.InAppBrowser) {
      const { InAppBrowser } = window.cordova
      const target = '_blank'
      const options = 'location=yes,hidden=no'
      const inAppBrowser = InAppBrowser.open(url, target, options)

      return new Promise((resolve) => {
        inAppBrowser.addEventListener('loadstart', ({url}) => {
          const accessCode = /\?access_code=(.+)$/.test(url)
          const state = /\?state=(.+)$/.test(url)

          if (accessCode || state) {
            resolve(url)
          }
        })
      })
      .then(
        (url) => {
          inAppBrowser.close()
          return url
        },
        (err) => {
          inAppBrowser.close()
          dispatch(error())
          throw err
        }
      )
    }
  }
}

const getAuth = () => ({
  storage: getStorage(),
  clientParams: getClientParams(),
  onRegistered: getOnRegistered()
})

export const init = (url) => {
  console.log('init', url)
  cozy.init({
    cozyURL: url,
    offline: {doctypes: ['io.cozy.files'], timer: 15},
    oauth: getAuth()
  })
}
