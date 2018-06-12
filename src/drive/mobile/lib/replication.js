/* global cozy emit */
const clientRevokedMsg = 'Client has been revoked'

export const startReplication = async (
  existingIndexes,
  hasFinishedFirstReplication,
  firstReplicationFinished,
  refreshFolder,
  revokeClient,
  indexesCreated
) => {
  try {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const createIndex = async fields => {
      const index = await db.createIndex({
        index: { fields }
      })
      return index.id
    }

    let indexes = existingIndexes || {}

    if (!indexes.folders) {
      indexes.folders = await createIndex(['dir_id', 'type', 'name'])
      indexesCreated(indexes)
    }

    if (!indexes.recent) {
      const ddoc = {
        _id: '_design/my_index',
        views: {
          recent_files: {
            map: function(doc) {
              if (!doc.trashed && doc.type !== 'directory') emit(doc.updated_at)
            }.toString()
          }
        }
      }
      await db.put(ddoc)
      indexes.recent = 'my_index/recent_files'
      indexesCreated(indexes)
    }

    if (!indexes.sort) {
      indexes.sort = {
        name: await createIndex(['name']),
        updated_at: await createIndex(['updated_at']),
        size: await createIndex(['size'])
      }
      indexesCreated(indexes)
    }

    if (!hasFinishedFirstReplication) {
      await startFirstReplication()
      console.log('End of first replication, warming up indexes')
      // we execute a first query so that the index is really created
      await db.query('my_index/recent_files', {
        limit: 0
      })
      // not sure this one is really necessary...
      if (indexes.folders) {
        await db.find({
          selector: {
            dir_id: { $gte: null },
            name: { $gte: null },
            type: { $gte: null }
          },
          use_index: indexes.folders,
          limit: 0
        })
      }
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
      console.log('replication timed out')
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
