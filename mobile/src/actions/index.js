import cozy, { LocalStorage } from 'cozy-client-js'

export const SETUP = 'SETUP'
export const SET_URL = 'SET_URL'

export const setupServerUrl = (router, location) => {
  return async (dispatch, getState) => {
    let oauth
    if (window.cordova && window.cordova.InAppBrowser) {
      oauth = {
        storage: new LocalStorage(),
        clientParams: {
          redirectURI: 'http://localhost',
          softwareID: 'io.cozy.mobile.files',
          clientName: 'Mobile Cozy Files',
          scopes: ['io.cozy.files:GET']
        },
        onRegistered: (client, url) => {
          if (window.cordova && window.cordova.InAppBrowser) {
            const { InAppBrowser } = window.cordova
            const target = '_blank'
            const options = 'location=yes,hidden=no'
            const inAppBrowser = InAppBrowser.open(url, target, options)

            return new Promise((resolve) => {
              inAppBrowser.addEventListener('loadstop', ({url}) => {
                var accessCode = /\?access_code=(.+)$/.exec(url)
                var state = /\?state=(.+)$/.exec(url)

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
                throw err
              }
            )
          }
        }
      }
    }

    cozy.init({
      cozyURL: `http://${getState().mobile.serverUrl}`,
      oauth: oauth
    })

    try {
      const creds = await cozy.authorize()
      console.log('creds', creds)
      dispatch({ type: SETUP })
      if (location.state && location.state.nextPathname) {
        router.replace(location.state.nextPathname)
      } else {
        router.replace('/')
      }
    } catch (err) {
      throw err
    }
  }
}
