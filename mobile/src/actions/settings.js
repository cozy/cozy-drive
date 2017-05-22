/* global cozy, __ALLOW_HTTP__ */

import { initClient } from '../lib/cozy-helper'
import { startReplication as startPouchReplication } from '../lib/replication'
import { setClient, setFirstReplication } from '../../../src/actions/settings'
import { getDeviceName } from '../lib/device'
import { openFolder } from '../../../src/actions'
import { onRegistered } from '../lib/registration'
import { logException, logInfo, configure as configureReporter } from '../lib/reporter'
import { pingOnceADay } from './timestamp'
import { revokeClient as reduxRevokeClient } from './authorization'

export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES = 'BACKUP_IMAGES'
export const WIFI_ONLY = 'WIFI_ONLY'
export const ERROR = 'ERROR'
export const SET_ANALYTICS = 'SET_ANALYTICS'

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

export const setAnalytics = (analytics, source = 'settings') => (dispatch, getState) => {
  dispatch({ type: SET_ANALYTICS, analytics })
  const state = getState()
  configureReporter(analytics)
  if (analytics && state.mobile) {
    const value = state.mobile.settings.backupImages
    logInfo(`${source}: backup images is ${value ? 'enabled' : 'disabled'}`)
    dispatch(pingOnceADay(state.mobile.timestamp, analytics))
  }
}
export const setBackupImages = backupImages => ({ type: BACKUP_IMAGES, backupImages })
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
  initClient(getState().mobile.settings.serverUrl, onRegister(dispatch), getDeviceName())
  await cozy.client.authorize().then(({ client }) => {
    dispatch(setClient(client))
    startReplication(dispatch, getState)
  }).catch(err => {
    dispatch(wrongAddressError())
    logException(err)
    throw err
  })
}

export const startReplication = (dispatch, getState) => {
  const firstReplication = getState().settings.firstReplication
  const refreshFolder = () => { dispatch(openFolder(getState().folder.id)) }
  const revokeClient = () => { dispatch(reduxRevokeClient()) }
  const firstReplicationFinished = () => { dispatch(setFirstReplication(true)) }

  startPouchReplication(firstReplication, firstReplicationFinished, refreshFolder, revokeClient)
}
