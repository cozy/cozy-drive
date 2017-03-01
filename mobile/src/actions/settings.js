/* global cozy, __ALLOW_HTTP__ */

import { initClient } from '../lib/cozy-helper'
import { onRegistered } from '../lib/registration'
import { logException } from '../lib/crash-reporter'

export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES_DISABLE = 'BACKUP_IMAGES_DISABLE'
export const BACKUP_IMAGES_ENABLE = 'BACKUP_IMAGES_ENABLE'
export const ERROR = 'ERROR'
export const SET_CLIENT = 'SET_CLIENT'

// url

export const setUrl = url => ({ type: SET_URL, url })
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

// backup images

export const enableBackupImages = () => ({type: BACKUP_IMAGES_ENABLE})
export const disableBackupImages = () => ({type: BACKUP_IMAGES_DISABLE})
export const setBackupImages = (value) => {
  if (value) {
    return enableBackupImages()
  } else {
    return disableBackupImages()
  }
}

// errors

export const wrongAddressErrorMsg = 'mobile.onboarding.server_selection.wrong_address'
export const wrongAddressError = () => ({ type: ERROR, error: wrongAddressErrorMsg })
export class OnBoardingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'OnBoardingError'
  }
}

// registration

export const registerDevice = () => async (dispatch, getState) => {
  await dispatch(checkURL(getState().mobile.settings.serverUrl))
  const device = window.cordova ? window.cordova.platformId : null
  const onRegister = (dispatch) => (client, url) => {
    return onRegistered(client, url)
    .then(url => url)
    .catch(err => {
      dispatch(wrongAddressError())
      logException(err)
      throw err
    })
  }
  await init(getState().mobile.settings.serverUrl, onRegister(dispatch), device)
  try {
    await cozy.client.authorize().then(({ client }) => dispatch(setClient(client)))
  initClient(getState().mobile.settings.serverUrl, onRegister(dispatch), device)
    await cozy.client.offline.replicateFromCozy('io.cozy.files')
  } catch (err) {
    dispatch(wrongAddressError())
    logException(err)
    throw err
  }
}

export const setClient = client => ({ type: SET_CLIENT, client })
