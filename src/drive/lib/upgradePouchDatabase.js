/* global cozy */

const upgradePouchDatabase = async dbName => {
  const db = cozy.client.offline.getDatabase(dbName)

  const infos = await db.info()
  if (infos.adapter === 'websql') {
    await cozy.client.offline.migrateDatabase(dbName)
    return true
  } else return false
}

export default upgradePouchDatabase
