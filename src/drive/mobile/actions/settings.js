/* global cozy */

import { checkURL, MAIL_EXCEPTION } from '../lib/cozy-helper'
import { startReplication as startPouchReplication } from '../lib/replication'
import { setClient, setFirstReplication } from '../../actions/settings'
import { openFolder, getOpenedFolderId } from '../../actions'
import { logException, configureReporter } from '../lib/reporter'
import { startTracker, stopTracker } from '../lib/tracker'
import { revokeClient as reduxRevokeClient } from './authorization'

export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES = 'BACKUP_IMAGES'
export const BACKUP_CONTACTS = 'BACKUP_CONTACTS'
export const WIFI_ONLY = 'WIFI_ONLY'
export const ERROR = 'ERROR'
export const SET_ANALYTICS = 'SET_ANALYTICS'
export const TOKEN_SCOPE = 'TOKEN_SCOPE'

// url

export const setUrl = url => ({ type: SET_URL, url })

// settings

export const setAnalytics = (analytics, source = 'settings') => (
  dispatch,
  getState
) => {
  dispatch({ type: SET_ANALYTICS, analytics })
  const state = getState()
  configureReporter(analytics)
  if (analytics && state.mobile) {
    startTracker(state.mobile.settings.serverUrl)
  } else if (analytics === false) {
    stopTracker()
  }
}
export const setBackupImages = backupImages => ({
  type: BACKUP_IMAGES,
  backupImages
})
export const setWifiOnly = wifiOnly => ({ type: WIFI_ONLY, wifiOnly })
export const setBackupContacts = backupContacts => ({
  type: BACKUP_CONTACTS,
  backupContacts
})
export const setTokenScope = scope => ({ type: TOKEN_SCOPE, scope })

// errors

export const wrongAddressErrorMsg =
  'mobile.onboarding.server_selection.wrong_address'
export const wrongAddressWithEmailErrorMsg =
  'mobile.onboarding.server_selection.wrong_address_with_email'
export const wrongAddressV2ErrorMsg =
  'mobile.onboarding.server_selection.wrong_address_v2'
export const wrongAddressError = () => ({
  type: ERROR,
  error: wrongAddressErrorMsg
})
export const wrongAddressWithEmailError = () => ({
  type: ERROR,
  error: wrongAddressWithEmailErrorMsg
})
export const wrongAddressV2Error = () => ({
  type: ERROR,
  error: wrongAddressV2ErrorMsg
})
export class OnBoardingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'OnBoardingError'
  }
}

// registration

export const registerDevice = cozyClient => async (dispatch, getState) => {
  let url
  try {
    url = checkURL(getState().mobile.settings.serverUrl)
    await dispatch(setUrl(url))
  } catch (err) {
    if (err.name === MAIL_EXCEPTION) {
      dispatch(wrongAddressWithEmailError())
    } else {
      dispatch(wrongAddressError())
    }
    throw err
  }

  let isV2Instance
  try {
    isV2Instance = await cozyClient.isV2(url)
  } catch (err) {
    // this can happen if the HTTP request to check the instance version fails;
    // in that case, it is likely to fail again and be caught during the authorize process,
    // which is designed to handle this
    isV2Instance = false
  }

  if (isV2Instance) {
    dispatch(wrongAddressV2Error())
    throw new Error('The cozy address entered is a V2 instance')
  }

  return cozyClient
    .register(getState().mobile.settings.serverUrl)
    .then(({ client, token }) => {
      dispatch(setClient(client))
      dispatch(setTokenScope(token.scope))
      startReplication(dispatch, getState)
    })
    .catch(err => {
      if (err.message === 'REGISTRATION_ABORT') {
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
  const refreshFolder = () => {
    dispatch(openFolder(getOpenedFolderId(getState())))
  }
  const revokeClient = () => {
    dispatch(reduxRevokeClient())
  }
  const firstReplicationFinished = () => {
    dispatch(setFirstReplication(true))
  }

  startPouchReplication(
    firstReplication,
    firstReplicationFinished,
    refreshFolder,
    revokeClient
  )
}
