/* global __TARGET__ */
import {
  SET_CLIENT,
  SET_OFFLINE,
  SET_FIRST_REPLICATION,
  SET_POUCH_INDEXES
} from '../actions/settings'

export const initialState = {
  offline: false,
  firstReplication: false,
  indexes: null,
  client: null
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT:
      return { ...state, offline: true, client: action.client }
    case SET_OFFLINE:
      return { ...state, offline: action.offline }
    case SET_FIRST_REPLICATION:
      return { ...state, firstReplication: action.firstReplication }
    case SET_POUCH_INDEXES:
      return { ...state, indexes: action.indexes }
    default:
      return state
  }
}

export const getClientSettings = state => state.settings.client
export const isOfflineCapable = state => state.settings.offline
export const isFirstReplicationDone = state => state.settings.firstReplication
export const getPouchIndexes = state => state.settings.indexes
export const shouldWorkFromPouchDB = state => {
  const settings = state.settings
  return (
    __TARGET__ === 'mobile' &&
    settings.offline &&
    settings.firstReplication &&
    settings.indexes
  )
}

export default settings
