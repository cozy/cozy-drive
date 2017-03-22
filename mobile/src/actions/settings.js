/* global cozy, __ALLOW_HTTP__ */

import { initClient, refreshFolder, onError } from '../lib/cozy-helper'
import { onRegistered } from '../lib/registration'
import { logException } from '../lib/crash-reporter'
import { startBackgroundService, stopBackgroundService } from '../lib/background'

export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES = 'BACKUP_IMAGES'
export const WIFI_ONLY = 'WIFI_ONLY'
export const ERROR = 'ERROR'
export const SET_CLIENT = 'SET_CLIENT'
export const SET_ANALYTICS = 'SET_ANALYTICS'

import { unrevokeClient } from './authorization'

// url

export const setUrl = url => ({ type: SET_URL, url })
export const checkURL = url => dispatch => {
  let scheme = 'https://'
  if (__ALLOW_HTTP__) {
    if (!url.startsWith(scheme)) scheme = 'http://'
    console.warn('development mode: we don\'t check SSL requirement')
  }
  if (/(.*):\/\/(.*)/.test(url) && !url.startsWith(scheme)) {
    dispatch(wrongAddressError())
    if (__ALLOW_HTTP__) {
      throw new OnBoardingError(`The supported protocols are http:// or https:// (development mode)`)
    }
    throw new OnBoardingError(`The only supported protocol is ${scheme}`)
  }
  if (!url.startsWith(scheme)) {
    url = `${scheme}${url}`
  }
  return dispatch(setUrl(url))
}

// settings

export const setAnalytics = analytics => ({ type: SET_ANALYTICS, analytics })
export const setBackupImages = backupImages => {
  backupImages ? startBackgroundService() : stopBackgroundService()
  return {type: BACKUP_IMAGES, backupImages}
}
export const setWifiOnly = wifiOnly => ({ type: WIFI_ONLY, wifiOnly })

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
  dispatch(checkURL(getState().mobile.settings.serverUrl))
  initClient(getState().mobile.settings.serverUrl, onRegister(dispatch), device)
  await cozy.client.authorize().then(async ({ client }) => {
    dispatch(unrevokeClient())
    dispatch(setClient(client))
    const options = {
      onError: onError(dispatch, getState),
      onComplete: refreshFolder(dispatch, getState)
    }
    cozy.client.offline.startRepeatedReplication('io.cozy.files', 15, options)
  }).catch(err => {
    dispatch(wrongAddressError())
    logException(err)
    throw err
  })
}

export const setClient = client => ({ type: SET_CLIENT, client })
