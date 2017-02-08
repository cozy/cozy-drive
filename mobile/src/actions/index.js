/* global __ALLOW_HTTP__ */

import cozy from 'cozy-client-js'
import { init } from '../lib/cozy_init'
import localforage from 'localforage'

import { DISPLAY_TOAST } from '../../../src/actions'

export const SETUP = 'SETUP'
export const SET_URL = 'SET_URL'
export const SET_STATE = 'SET_STATE'
export const ERROR = 'ERROR'

const WRONG_ADDRESS_ERROR = 'mobile.onboarding.server_selection.wrong_address'
const OPEN_WITH_OFFLINE_ERROR = 'mobile.error.open_with.offline'
const OPEN_WITH_NO_APP_ERROR = 'mobile.error.open_with.noapp'

export const wrongAddressError = () => ({ type: ERROR, error: WRONG_ADDRESS_ERROR })
export const openWithOfflineError = () => ({ type: DISPLAY_TOAST, message: OPEN_WITH_OFFLINE_ERROR })
export const openWithNoAppError = () => ({ type: DISPLAY_TOAST, message: OPEN_WITH_NO_APP_ERROR })

export class OnBoardingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'OnBoardingError'
  }
}

export const setUrl = (url) => {
  return async dispatch => {
    let scheme = 'https://'
    if (__ALLOW_HTTP__) {
      scheme = 'http://'
      console.warn('development mode: we don\'t check SSL requirement')
    }
    if (/(.*):\/\/(.*)/.test(url) && !url.startsWith(scheme)) {
      dispatch(wrongAddressError())
      throw new OnBoardingError(`The only supported protocol is ${scheme}`)
    }
    if (!url.startsWith(scheme)) {
      url = `${scheme}${url}`
    }
    return dispatch({ type: SET_URL, url: url })
  }
}

const onRegistered = (dispatch) => {
  const { cordova } = window
  return (client, url) => {
    if (cordova && cordova.InAppBrowser) {
      const { InAppBrowser } = cordova
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

// TODO need to refactor this braces hell
export const registerDevice = (router, location) => {
  return async (dispatch, getState) => {
    await dispatch(setUrl(getState().mobile.serverUrl))
    await init(getState().mobile.serverUrl, onRegistered(dispatch))
    try {
      await cozy.authorize()
      await cozy.offline.replicateFromCozy('io.cozy.files')
    } catch (err) {
      dispatch(wrongAddressError())
      throw err
    }

    dispatch({ type: SETUP })
    localforage.setItem('state', getState().mobile)
    if (location.state && location.state.nextPathname) {
      router.replace(location.state.nextPathname)
    } else {
      router.replace('/')
    }
  }
}
