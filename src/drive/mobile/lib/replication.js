/* global cozy */
import { clientRevokedMsg } from './cozy-helper'

export const startReplication = async (
  hasFinishedFirstReplication,
  firstReplicationFinished,
  refreshFolder,
  revokeClient
) => {
  try {
    if (!hasFinishedFirstReplication) {
      await startFirstReplication()
      console.log('End of first replication')
      firstReplicationFinished()
    }

    /* const docsWritten = */ await startRepeatedReplication()
    cozy.client.settings.updateLastSync()
    // NB: this refresh breaks the recent view if it is displayed during replication
    // if (docsWritten !== 0) refreshFolder()
  } catch (err) {
    if (
      err.message === clientRevokedMsg ||
      err.error === 'code=400, message=Invalid JWT token'
    ) {
      console.warn('The device is not connected to your server anymore')
      revokeClient()
    } else if (err.message === 'ETIMEDOUT') {
      console.log('replcation timed out')
    } else {
      console.warn(err)
    }
  }
}

const startRepeatedReplication = () => {
  return new Promise((resolve, reject) => {
    const options = {
      onError: reject,
      onComplete: result => {
        resolve(result.docs_written)
      }
    }
    cozy.client.offline.startRepeatedReplication('io.cozy.files', 15, options)
  })
}

const startFirstReplication = () => {
  return new Promise((resolve, reject) => {
    const options = {
      onError: reject,
      onComplete: resolve
    }
    cozy.client.offline.replicateFromCozy('io.cozy.files', options)
  })
}
