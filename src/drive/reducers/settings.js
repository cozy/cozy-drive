import { SET_CLIENT, SET_OFFLINE, SET_FIRST_REPLICATION } from '../actions/settings'

export const initialState = {
  offline: false,
  firstReplication: false
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT:
      return { ...state, offline: true, client: action.client }
    case SET_OFFLINE:
      return { ...state, offline: action.offline }
    case SET_FIRST_REPLICATION:
      return { ...state, firstReplication: action.firstReplication }
    default:
      return state
  }
}

export default settings
