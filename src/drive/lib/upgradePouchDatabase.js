/* global cozy */

const upgradePouchDatabase = async (dbName, existingIndexes = []) => {
  const db = cozy.client.offline.getDatabase(dbName)

  const infos = await db.info()
  const isAdapterOutdated = infos.adapter === 'websql'

  if (isAdapterOutdated) {
    try {
      await cozy.client.offline.migrateDatabase(dbName)
      return true
    } catch (err) {
      console.warn(err)
      return false
    }
  } else {
    const { indexes } = await db.getIndexes()
    const missingIndexes = existingIndexes.filter(
      existingIndex => !indexes.find(index => index.ddoc === existingIndex)
    )

    return missingIndexes.length > 0 ? true : false
  }
}

export default upgradePouchDatabase
