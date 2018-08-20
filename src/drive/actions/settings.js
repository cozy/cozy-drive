export const SET_CLIENT = 'SET_CLIENT'
export const SET_OFFLINE = 'SET_OFFLINE'
export const SET_FIRST_REPLICATION = 'SET_FIRST_REPLICATION'
export const SET_POUCH_INDEXES = 'SET_POUCH_INDEXES'

export const setClient = client => ({ type: SET_CLIENT, client })
export const setOffline = offline => ({ type: SET_OFFLINE, offline })
export const setFirstReplication = firstReplication => ({
  type: SET_FIRST_REPLICATION,
  firstReplication
})
export const setPouchIndexes = indexes => ({
  type: SET_POUCH_INDEXES,
  indexes
})
