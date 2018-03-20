import { startReplication as startPouchReplication } from '../lib/replication'
import {
  setClient,
  setFirstReplication,
  setPouchIndexes
} from '../../actions/settings'
import { openFolder, getOpenedFolderId } from '../../actions'
import { startTracker, stopTracker } from '../lib/tracker'
import { revokeClient as reduxRevokeClient } from './authorization'
import { resetClient } from '../lib/cozy-helper'

export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES = 'BACKUP_IMAGES'
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
export const setTokenScope = scope => ({ type: TOKEN_SCOPE, scope })

export const saveCredentials = (client, token) => (dispatch, getState) => {
  dispatch(setClient(client))
  dispatch(setTokenScope(token.scope))
  startReplication(dispatch, getState)
}

export const startReplication = (dispatch, getState) => {
  const firstReplication = getState().settings.firstReplication
  const hasIndexes = getState().settings.indexes
  const refreshFolder = () => {
    dispatch(openFolder(getOpenedFolderId(getState())))
  }
  const revokeClient = () => {
    resetClient()
    dispatch(reduxRevokeClient())
  }
  const firstReplicationFinished = () => {
    dispatch(setFirstReplication(true))
  }
  const indexesCreated = indexes => {
    dispatch(setPouchIndexes(indexes))
  }

  startPouchReplication(
    hasIndexes,
    firstReplication,
    firstReplicationFinished,
    refreshFolder,
    revokeClient,
    indexesCreated
  )
}
