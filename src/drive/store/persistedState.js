import localforage from 'localforage'

// We had some settings that were persisted outside of mobile.settings prior to 1.8.1
const shouldMigrateSettings = state => state.hasOwnProperty('settings')

const migrateSettings = async prevState => {
  const { firstReplication, client, indexes, offline } = prevState.settings
  const {
    authorized,
    token,
    serverUrl,
    backupImages,
    analytics,
    wifiOnly
  } = prevState.mobile.settings
  const { revoked } = prevState.mobile.authorization
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
        firstReplication,
        indexes,
        serverUrl,
        backupImages,
        analytics,
        wifiOnly
      },
      mediaBackup: prevState.mediaBackup
    },
    availableOffline: prevState.availableOffline
  }
  await localforage.setItem('state', newState)
  console.info('Migrated persisted settings')
  console.info('Previously persisted state: ', prevState)
  console.info('New persisted state: ', newState)
  return newState
}

export const loadState = async () => {
  try {
    const persistedState = await localforage.getItem('state')
    if (persistedState === null) {
      return undefined
    }
    if (shouldMigrateSettings(persistedState)) {
      console.warn('Migrating persisted settings')
      const newState = await migrateSettings(persistedState)
      return newState
    }
    return persistedState
  } catch (err) {
    console.warn(err)
    return undefined
  }
}

export const saveState = async state => {
  try {
    await localforage.setItem('state', state)
  } catch (err) {
    console.warn(err)
  }
}

export const resetPersistedState = () => localforage.clear()
