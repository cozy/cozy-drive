/* global __ALLOW_HTTP__ */

import { init } from '../lib/cozy-helper'
import cozy from 'cozy-client-js'
import localforage from 'localforage'
import initialState from '../reducers/mobile'

import { OPEN_FILE_E_OFFLINE, OPEN_FILE_E_NO_APP } from '../../../src/actions'

export const SETUP = 'SETUP'
export const SET_URL = 'SET_URL'
export const SET_STATE = 'SET_STATE'
export const ERROR = 'ERROR'
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const SHOW_UNLINK_CONFIRMATION = 'SHOW_UNLINK_CONFIRMATION'
export const HIDE_UNLINK_CONFIRMATION = 'HIDE_UNLINK_CONFIRMATION'

const WRONG_ADDRESS_ERROR = 'mobile.onboarding.server_selection.wrong_address'
const OPEN_WITH_OFFLINE_ERROR = 'mobile.error.open_with.offline'
const OPEN_WITH_NO_APP_ERROR = 'mobile.error.open_with.noapp'

export const wrongAddressError = () => ({ type: ERROR, error: WRONG_ADDRESS_ERROR })
export const openWithOfflineError = () => ({ type: OPEN_FILE_E_OFFLINE, message: OPEN_WITH_OFFLINE_ERROR })
export const openWithNoAppError = () => ({ type: OPEN_FILE_E_NO_APP, message: OPEN_WITH_NO_APP_ERROR })

export class OnBoardingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'OnBoardingError'
  }
}

export const showUnlinkConfirmation = () => async dispatch => {
  return dispatch({ type: SHOW_UNLINK_CONFIRMATION })
}

export const hideUnlinkConfirmation = () => async dispatch => {
  return dispatch({ type: HIDE_UNLINK_CONFIRMATION })
}

export const unlink = () => async dispatch => {
  dispatch({ type: SET_STATE, initialState })
  localforage.clear()
  cozy.offline.destroyDatabase('io.cozy.files')
  // TODO: unregister client on Gozy
  // const client = await cozy.auth.getClient()
  // cozy.auth.unregisterClient(client)
}

export const checkURL = url => async dispatch => {
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

const openRegistrationWith = inAppBrowser => new Promise((resolve) => {
  inAppBrowser.addEventListener('loadstart', ({url}) => {
    const accessCode = /\?access_code=(.+)$/.test(url)
    const state = /\?state=(.+)$/.test(url)

    if (accessCode || state) {
      resolve(url)
    }
  })
})

const onRegistered = dispatch => (client, url) => {
  if (window.cordova && window.cordova.InAppBrowser) {
    const target = '_blank'
    const options = 'location=yes,hidden=no'
    const inAppBrowser = window.cordova.InAppBrowser.open(url, target, options)
    return openRegistrationWith(inAppBrowser)
    .then(
      url => {
        inAppBrowser.close()
        return url
      },
      err => {
        inAppBrowser.close()
        dispatch(wrongAddressError())
        throw err
      }
    )
  }
}

export const registerDevice = (router, location) => async (dispatch, getState) => {
  await dispatch(checkURL(getState().mobile.serverUrl))
  const device = window.cordova ? window.cordova.platformId : null
  await init(getState().mobile.serverUrl, onRegistered(dispatch), device)
  try {
    await cozy.authorize()
    await cozy.offline.replicateFromCozy('io.cozy.files')
  } catch (err) {
    dispatch(wrongAddressError())
    throw err
  }

  // TODO move this outside of this action (may be in the smart component's behavior)
  dispatch({ type: SETUP })
  localforage.setItem('state', getState().mobile)
  if (location.state && location.state.nextPathname) {
    router.replace(location.state.nextPathname)
  } else {
    router.replace('/')
  }
}

export const updateSettings = (newSettings) => ({ type: UPDATE_SETTINGS, newSettings })
