import {
  SET_CLIENT,
  SET_OFFLINE,
  SET_FIRST_REPLICATION,
  SET_POUCH_INDEXES
} from '../actions/settings'

export const initialState = {
  offline: false,
  firstReplication: false,
  indexes: null
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

export default settings
