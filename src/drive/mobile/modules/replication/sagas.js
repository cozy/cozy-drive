import {
  openFolder,
  getOpenedFolderId
} from 'drive/web/modules/navigation/duck'
import { revokeClient as reduxRevokeClient } from 'drive/mobile/modules/authorization/duck'

import {
  startReplication as startPouchReplication,
  createIndexes,
  warmUpIndexes
} from 'drive/mobile/lib/replication'
import { resetClient } from 'drive/mobile/lib/cozy-helper'
import {
  upgradePouchDatabase,
  checkMissingIndexes
} from 'drive/lib/upgradePouchDatabase'

import {
  isFirstReplicationDone,
  getPouchIndexes,
  setFirstReplication,
  setPouchIndexes
} from './duck'

export const startReplication = () => async (dispatch, getState) => {
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

  const didUpgrade = await upgradePouchDatabase('io.cozy.files')
  const areIndexesMissing =
    existingIndexes &&
    Object.values(existingIndexes).length > 0 &&
    (await checkMissingIndexes('io.cozy.files', [
      existingIndexes.byName,
      existingIndexes.bySize,
      existingIndexes.byUpdatedAt
    ]))

  if (didUpgrade || areIndexesMissing) {
    indexesCreated({})
    const indexes = await createIndexes({}, indexesCreated)
    await warmUpIndexes(indexes)
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
