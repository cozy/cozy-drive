import { SET_TIMESTAMP } from '../actions/timestamp'

export function timestamp (state = Date.now(), action) {
  switch (action.type) {
    case SET_TIMESTAMP:
      return action.timestamp
    default:
      return state
  }
}
