import localforage from 'localforage'
import logger from 'lib/logger'
// We had some settings that were persisted outside of mobile.settings prior to 1.8.1
const shouldMigrateSettings = state => state.hasOwnProperty('settings')

const migrateSettings = async prevState => {
  const { client, offline } = prevState.settings
  const { authorized, token, serverUrl, backupImages, analytics, wifiOnly } =
    prevState.mobile.settings
  const { revoked } = prevState.mobile.authorization || { revoked: false }
  const newState = {
    mobile: {
      authorization: {
        authorized,
        revoked,
        client,
        token
      },
      settings: {
        offline,
        serverUrl,
        backupImages,
        analytics,
        wifiOnly
      },
      mediaBackup: prevState.mobile.mediaBackup
    },
    availableOffline: prevState.availableOffline
  }
  await localforage.setItem('state', newState)
  logger.info('Migrated persisted settings')
  logger.info('Previously persisted state: ', prevState)
  logger.info('New persisted state: ', newState)
  return newState
}

export const loadState = async () => {
  try {
    const persistedState = await localforage.getItem('state')
    if (persistedState === null) {
      return undefined
    }
    if (shouldMigrateSettings(persistedState)) {
      logger.warn('Migrating persisted settings')
      const newState = await migrateSettings(persistedState)
      return newState
    }
    return persistedState
  } catch (err) {
    logger.warn(err)
    return undefined
  }
}

export const saveState = async state => {
  try {
    await localforage.setItem('state', state)
  } catch (err) {
    logger.warn(err)
  }
}

export const resetPersistedState = () => localforage.clear()
