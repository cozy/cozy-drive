import {
  openFolder,
  getOpenedFolderId
} from 'drive/web/modules/navigation/duck'
import { revokeClient as reduxRevokeClient } from 'drive/mobile/modules/authorization/duck'

import { startReplication as startPouchReplication } from 'drive/mobile/lib/replication'
import { resetClient } from 'drive/mobile/lib/cozy-helper'

import {
  isFirstReplicationDone,
  getPouchIndexes,
  setFirstReplication,
  setPouchIndexes
} from './duck'

export const startReplication = () => (dispatch, getState) => {
  console.info('Starting replication...')

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
