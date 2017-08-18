import { SET_TIMESTAMP } from '../actions/timestamp'

export function timestamp (state = null, action) {
  switch (action.type) {
    case SET_TIMESTAMP:
      return action.timestamp
    default:
      return state
  }
}
