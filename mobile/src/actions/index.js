/* global __ALLOW_HTTP__ */

import { init } from '../lib/cozy-helper'
import cozy from 'cozy-client-js'
import localforage from 'localforage'

import { OPEN_FILE_E_OFFLINE, OPEN_FILE_E_NO_APP } from '../../../src/actions'

export const SET_URL = 'SET_URL'
export const SET_STATE = 'SET_STATE'
export const INITIALIZE_STATE = 'INITIALIZE_STATE'
export const ERROR = 'ERROR'
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const SHOW_UNLINK_CONFIRMATION = 'SHOW_UNLINK_CONFIRMATION'
export const HIDE_UNLINK_CONFIRMATION = 'HIDE_UNLINK_CONFIRMATION'

export const SET_CLIENT = 'SET_CLIENT'

const WRONG_ADDRESS_ERROR = 'mobile.onboarding.server_selection.wrong_address'
const OPEN_WITH_OFFLINE_ERROR = 'mobile.error.open_with.offline'
const OPEN_WITH_NO_APP_ERROR = 'mobile.error.open_with.noapp'

const ALERT_TYPE_ERROR = 'error'
export const setUrl = url => ({ type: SET_URL, url })

export const wrongAddressError = () => ({ type: ERROR, error: WRONG_ADDRESS_ERROR })
export const openWithOfflineError = () => ({ type: OPEN_FILE_E_OFFLINE, alert: { message: OPEN_WITH_OFFLINE_ERROR, type: ALERT_TYPE_ERROR } })
export const openWithNoAppError = () => ({ type: OPEN_FILE_E_NO_APP, alert: { message: OPEN_WITH_NO_APP_ERROR, type: ALERT_TYPE_ERROR } })

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
  dispatch({ type: INITIALIZE_STATE })
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
  return dispatch(setUrl(url))
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
  } else {
    /**
     * for dev purpose:
     * In oauth workflow, the server displays an authorization page
     * User must accept to give permission then the server gives an url
     * with query parameters used by cozy-client-js to initialize itself.
     *
     * This hack let developers open the authorization page in a new tab
     * then get the "access_code" url and paste it in the prompt to let the
     * application initialize and redirect to other pages.
     */
    console.log(url)
    return new Promise(resolve => {
      setTimeout(() => {
        const token = prompt('Paste the url here:')
        resolve(token)
      }, 10000)
    })
  }
}

export const registerDevice = () => async (dispatch, getState) => {
  await dispatch(checkURL(getState().mobile.settings.serverUrl))
  const device = window.cordova ? window.cordova.platformId : null
  await init(getState().mobile.settings.serverUrl, onRegistered(dispatch), device)
  try {
    await cozy.authorize()
    await cozy.offline.replicateFromCozy('io.cozy.files')
  } catch (err) {
    dispatch(wrongAddressError())
    throw err
  }
}

export const updateSettings = (newSettings) => ({ type: UPDATE_SETTINGS, newSettings })
