import { SET_CLIENT } from '../actions/settings'
import { getServerUrl } from '../reducers/settings'
import { REVOKE, UNREVOKE } from '../actions/authorization'

export const initialState = {}

export const authorization = (state = initialState, action) => {
  switch (action.type) {
    case REVOKE:
      return { ...state, revoked: true }
    case UNREVOKE:
      return { ...state, revoked: false }
    case SET_CLIENT:
      return { ...state, revoked: false }
    default:
      return state
  }
}

export const isRevoked = state =>
  state.mobile &&
  state.mobile.authorization &&
  state.mobile.authorization.revoked

export const isClientRevoked = (error, state) => {
  return (
    getServerUrl(state) &&
    (error.status === 404 ||
      error.status === 401 ||
      error.message.match(/Client has been revoked/))
  )
}
