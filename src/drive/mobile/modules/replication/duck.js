/* global __TARGET__ */
import { isOfflineCapable } from 'drive/mobile/modules/settings/duck'

const SET_FIRST_REPLICATION = 'SET_FIRST_REPLICATION'
const SET_POUCH_INDEXES = 'SET_POUCH_INDEXES'

const initialState = {
  firstReplication: false,
  indexes: null
}

const replication = (state = initialState, action) => {
  switch (action.type) {
    case SET_FIRST_REPLICATION:
      return { ...state, firstReplication: action.firstReplication }
    case SET_POUCH_INDEXES:
      return { ...state, indexes: action.indexes }
    default:
      return state
  }
}

export default replication

export const getPouchIndexes = state =>
  state.mobile && state.mobile.replication && state.mobile.replication.indexes

export const isFirstReplicationDone = state =>
  state.mobile &&
  state.mobile.replication &&
  state.mobile.replication.firstReplication

export const shouldWorkFromPouchDB = state =>
  __TARGET__ === 'mobile' &&
  isOfflineCapable(state) &&
  isFirstReplicationDone(state) &&
  getPouchIndexes(state) !== null

export const setFirstReplication = firstReplication => ({
  type: SET_FIRST_REPLICATION,
  firstReplication
})

export const setPouchIndexes = indexes => ({
  type: SET_POUCH_INDEXES,
  indexes
})
