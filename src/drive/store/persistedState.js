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
      replication: {
        firstReplication,
        indexes
      },
      mediaBackup: prevState.mobile.mediaBackup
    },
    availableOffline: prevState.availableOffline
  }
  await localforage.setItem('state', newState)
  /* eslint-disable no-console */
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
      // eslint-disable-next-line no-console
      console.warn('Migrating persisted settings')
      const newState = await migrateSettings(persistedState)
      return newState
    }
    return persistedState
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return undefined
  }
}

export const saveState = async state => {
  try {
    await localforage.setItem('state', state)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
  }
}

export const resetPersistedState = () => localforage.clear()
