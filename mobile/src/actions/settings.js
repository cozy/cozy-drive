/* global cozy */

import { initClient, checkURL, MAIL_EXCEPTION } from '../lib/cozy-helper'
import { startReplication as startPouchReplication } from '../lib/replication'
import { setClient, setFirstReplication } from '../../../src/actions/settings'
import { getDeviceName } from '../lib/device'
import { openFolder } from '../../../src/actions'
import { REGISTRATION_ABORT, onRegistered } from '../lib/registration'
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
export const wrongAddressWithEmailErrorMsg = 'mobile.onboarding.server_selection.wrong_address_with_email'
export const wrongAddressError = () => ({ type: ERROR, error: wrongAddressErrorMsg })
export const wrongAddressWithEmailError = () => ({ type: ERROR, error: wrongAddressWithEmailErrorMsg })
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
      if (err.message !== REGISTRATION_ABORT) {
        dispatch(wrongAddressError())
        logException(err)
      }
      throw err
    })
  }
  try {
    const url = checkURL(getState().mobile.settings.serverUrl)
    await dispatch(setUrl(url))
  } catch (err) {
    if (err.name === MAIL_EXCEPTION) {
      dispatch(wrongAddressWithEmailError())
    } else {
      dispatch(wrongAddressError())
    }
    throw err
  }
  initClient(getState().mobile.settings.serverUrl, onRegister(dispatch), getDeviceName())
  await cozy.client.authorize().then(({ client }) => {
    dispatch(setClient(client))
    startReplication(dispatch, getState)
  }).catch(err => {
    if (err.message === REGISTRATION_ABORT) {
      cozy.client._storage.clear()
    } else {
      dispatch(wrongAddressError())
      logException(err)
    }
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
