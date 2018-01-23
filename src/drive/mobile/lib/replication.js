/* global cozy emit */
import { clientRevokedMsg } from './cozy-helper'

export const startReplication = async (
  hasIndexes,
  hasFinishedFirstReplication,
  firstReplicationFinished,
  refreshFolder,
  revokeClient,
  indexesCreated
) => {
  try {
    let db, folderIndex
    if (!hasIndexes) {
      db = cozy.client.offline.getDatabase('io.cozy.files')
      folderIndex = await db.createIndex({
        index: { fields: ['dir_id', 'type', 'name'] }
      })
      const ddoc = {
        _id: '_design/my_index',
        views: {
          recent_files: {
            map: function(doc) {
              if (!doc.trashed) emit(doc.updated_at)
            }.toString()
          }
        }
      }
      await db.put(ddoc)
      indexesCreated({
        folders: folderIndex.id,
        recent: 'my_index/recent_files'
      })
    }

    if (!hasFinishedFirstReplication) {
      await startFirstReplication()
      console.log('End of first replication, warming up indexes')
      // we execute a first query so that the index is really created
      await db.query('my_index/recent_files', {
        limit: 0
      })
      // not sure this one is really necessary...
      await db.find({
        selector: {
          dir_id: { $gte: null },
          name: { $gte: null },
          type: { $gte: null }
        },
        use_index: folderIndex.id,
        limit: 0
      })
      console.log('indexes ready')
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
