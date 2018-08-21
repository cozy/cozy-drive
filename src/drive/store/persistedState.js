import localforage from 'localforage'

// We had some settings that were persisted outside of mobile.settings prior to 1.8.1
const shouldMigrateSettings = state => state.hasOwnProperty('settings')

const migrateSettings = async prevState => {
  const newState = {
    mobile: {
      settings: { ...prevState.mobile.settings, ...prevState.settings },
      mediaBackup: prevState.mediaBackup
    },
    availableOffline: prevState.availableOffline
  }
  await localforage.setItem('state', newState)
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
