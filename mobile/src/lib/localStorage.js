import localforage from 'localforage'

export const loadState = async () => {
  try {
    const persistedState = await localforage.getItem('state')
    if (persistedState === null) {
      return undefined
    }
    return persistedState
  } catch (err) {
    return undefined
  }
}

export const saveState = async (state) => {
  try {
    localforage.setItem('state', state)
  } catch (err) {
    // Errors handling
  }
}
