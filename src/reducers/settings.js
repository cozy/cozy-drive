import { SET_OFFLINE, SET_FIRST_REPLICATION, INIT_STATE } from '../actions'

export const initialState = {
  offline: false,
  firstReplication: false
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_OFFLINE:
      return { ...state, offline: action.offline }
    case SET_FIRST_REPLICATION:
      return { ...state, firstReplication: action.firstReplication }
    case INIT_STATE:
      return initialState
    default:
      return state
  }
}

export default settings
