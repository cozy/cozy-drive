/* global cozy emit */
import { ROOT_DIR_ID } from '../../constants/config.js'
import upgradePouchDatabase from 'drive/lib/upgradePouchDatabase'

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
    upgradePouchDatabase('io.cozy.files')

    const indexes = await createIndexes(existingIndexes, indexesCreated)

    if (!hasFinishedFirstReplication) {
      await startFirstReplication()
      console.log('End of first replication, warming up indexes')
      await warmUpIndexes(indexes)
      console.log('indexes ready')
      firstReplicationFinished()
    }

    startRepeatedReplication({
      afterReplication: infos => {
        if (infos.docs_written > 0) {
          warmUpIndexes(indexes)
        }
      }
    })
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

const createIndexes = async (existingIndexes, indexesCreated) => {
  const db = cozy.client.offline.getDatabase('io.cozy.files')

  const createIndex = async fields => {
    const index = await db.createIndex({
      index: { fields }
    })
    return index.id
  }

  let indexes = existingIndexes || {}

  if (!indexes.byName) {
    indexes.byName = await createIndex(['dir_id', 'type', 'name'])
    indexesCreated(indexes)
  }

  if (!indexes.byUpdatedAt) {
    indexes.byUpdatedAt = await createIndex(['dir_id', 'type', 'updated_at'])
    indexesCreated(indexes)
  }

  if (!indexes.bySize) {
    indexes.bySize = await createIndex(['dir_id', 'type', 'size'])
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

  return indexes
}

const warmUpIndexes = async indexes => {
  const warmUpIndex = (index, attribute) =>
    db.find({
      selector: {
        dir_id: ROOT_DIR_ID,
        type: 'directory',
        [attribute]: { $gte: null }
      },
      use_index: index,
      limit: 0
    })

  // we execute a first query so that the index is really created
  const db = cozy.client.offline.getDatabase('io.cozy.files')
  await db.query('my_index/recent_files', {
    limit: 0
  })

  if (indexes.byName) await warmUpIndex(indexes.byName, 'name')
  if (indexes.byUpdatedAt) await warmUpIndex(indexes.byUpdatedAt, 'updated_at')
  if (indexes.bySize) await warmUpIndex(indexes.bySize, 'size')
}

const startRepeatedReplication = ({ afterReplication }) => {
  return new Promise((resolve, reject) => {
    const options = {
      onError: error => {
        console.warn(error)
        reject(error)
      },
      onComplete: result => {
        resolve()
        afterReplication(result)
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
