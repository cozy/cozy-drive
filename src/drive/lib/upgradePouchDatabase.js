/* global cozy */

export const upgradePouchDatabase = async dbName => {
  const db = cozy.client.offline.getDatabase(dbName)

  const infos = await db.info()
  const isAdapterOutdated = infos.adapter !== 'idb'

  if (isAdapterOutdated) {
    try {
      await cozy.client.offline.migrateDatabase(dbName)
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err)
      return false
    }
  } else {
    return false
  }
}

export const checkMissingIndexes = async (dbName, existingIndexes) => {
  const db = cozy.client.offline.getDatabase(dbName)
  const { indexes } = await db.getIndexes()

  const missingIndexes = existingIndexes.filter(
    existingIndex => !indexes.find(index => index.ddoc === existingIndex)
  )

  return missingIndexes.length > 0
}
