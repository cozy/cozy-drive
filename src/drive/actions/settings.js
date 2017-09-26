export const SET_CLIENT = 'SET_CLIENT'
export const SET_OFFLINE = 'SET_OFFLINE'
export const SET_FIRST_REPLICATION = 'SET_FIRST_REPLICATION'

export const setClient = client => ({ type: SET_CLIENT, client })
export const setOffline = offline => ({ type: SET_OFFLINE, offline })
export const setFirstReplication = firstReplication => ({
  type: SET_FIRST_REPLICATION,
  firstReplication
})
