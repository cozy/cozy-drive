import { startReplication as startPouchReplication } from '../lib/replication'
import {
  setClient,
  setFirstReplication,
  setPouchIndexes
} from '../../actions/settings'
import {
  isFirstReplicationDone,
  getPouchIndexes
} from '../../reducers/settings'
import { openFolder, getOpenedFolderId } from '../../actions'
import { startTracker, stopTracker } from '../lib/tracker'
import { revokeClient as reduxRevokeClient } from './authorization'
import { resetClient } from '../lib/cozy-helper'

import {
  SET_URL,
  BACKUP_IMAGES,
  SET_ANALYTICS,
  WIFI_ONLY,
  SET_TOKEN,
  getServerUrl
} from '../reducers/settings'

// url

export const setUrl = url => ({ type: SET_URL, url })

// settings

export const setAnalytics = (analytics, source = 'settings') => (
  dispatch,
  getState
) => {
  dispatch({ type: SET_ANALYTICS, analytics })
  const serverUrl = getServerUrl(getState())
  if (analytics && serverUrl) {
    startTracker(serverUrl)
  } else if (analytics === false) {
    stopTracker()
  }
}
export const setBackupImages = backupImages => ({
  type: BACKUP_IMAGES,
  backupImages
})
export const setWifiOnly = wifiOnly => ({ type: WIFI_ONLY, wifiOnly })
export const setToken = token => ({ type: SET_TOKEN, token })

export const saveCredentials = (client, token) => (dispatch, getState) => {
  dispatch(setClient(client))
  dispatch(setToken(token))
  startReplication(dispatch, getState)
}

export const startReplication = (dispatch, getState) => {
  const firstReplication = isFirstReplicationDone(getState())
  const existingIndexes = getPouchIndexes(getState())
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
    existingIndexes,
    firstReplication,
    firstReplicationFinished,
    refreshFolder,
    revokeClient,
    indexesCreated
  )
}
