import cozy, { LocalStorage as Storage } from 'cozy-client-js'
import localforage from 'localforage'

export const SETUP = 'SETUP'
export const SET_URL = 'SET_URL'
export const SET_STATE = 'SET_STATE'

export const registerDevice = (router, location) => {
  return async (dispatch, getState) => {
    let oauth
    if (window.cordova && window.cordova.InAppBrowser) {
      oauth = {
        storage: new Storage(),
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
                throw err
              }
            )
          }
        }
      }
    }

    cozy.init({
      cozyURL: `${getState().mobile.serverUrl}`,
      offline: {doctypes: ['io.cozy.files'], timer: 15},
      oauth: oauth
    })

    await cozy.authorize()
    dispatch({ type: SETUP })
    localforage.setItem('state', getState().mobile)
    if (location.state && location.state.nextPathname) {
      router.replace(location.state.nextPathname)
    } else {
      router.replace('/')
    }
  }
}
