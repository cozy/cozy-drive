/* global cozy */

const upgradePouchDatabase = async dbName => {
  const db = cozy.client.offline.getDatabase(dbName)

  const infos = await db.info()
  if (infos.adapter === 'websql') cozy.client.offline.migrateDatabase(dbName)
}

export default upgradePouchDatabase
