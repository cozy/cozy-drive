/* global cozy */
import { clientRevokedMsg } from './cozy-helper'

export const startReplication = (
  firstReplication,
  firstReplicationFinished,
  refreshFolder,
  revokeClient
) => {
  if (firstReplication) {
    startRepeatedReplication(refreshFolder, revokeClient)
  } else {
    startFirstReplication(firstReplicationFinished, refreshFolder, revokeClient)
  }
}

const startRepeatedReplication = (refreshFolder, revokeClient) => {
  const options = {
    onError: onError(revokeClient),
    onComplete: result => {
      if (result.docs_written !== 0) {
        refreshFolder()
      }
    }
  }
  cozy.client.offline.startRepeatedReplication('io.cozy.files', 15, options)
}

const startFirstReplication = (
  firstReplicationFinished,
  refreshFolder,
  revokeClient
) => {
  const options = {
    onError: onError(revokeClient),
    onComplete: () => {
      firstReplicationFinished()
      startRepeatedReplication(refreshFolder, revokeClient)
    }
  }
  cozy.client.offline.replicateFromCozy('io.cozy.files', options).then(() => {
    console.log('End of Replication')
  })
}

export const onError = revokeClient => err => {
  if (
    err.message === clientRevokedMsg ||
    err.error === 'code=400, message=Invalid JWT token'
  ) {
    console.warn('Your device is no more connected to your server')
    revokeClient()
  } else if (err.message === 'ETIMEDOUT') {
    console.log('timeout')
  } else {
    console.warn(err)
  }
}
