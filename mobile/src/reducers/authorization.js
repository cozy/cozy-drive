import { REVOKE, UNREVOKE } from '../actions/authorization'

export const initialState = {
}

export const authorization = (state = initialState, action) => {
  switch (action.type) {
    case REVOKE:
      return { ...state, revoked: true }
    case UNREVOKE:
      return { ...state, revoked: false }
    default:
      return state
  }
}
