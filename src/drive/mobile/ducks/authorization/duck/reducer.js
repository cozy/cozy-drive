import { getServerUrl } from 'drive/mobile/ducks/settings'
import { SET_CLIENT, SET_TOKEN, REVOKE, UNREVOKE } from './actions'

const initialState = {
  authorized: false,
  revoked: false,
  client: null,
  token: null
}

const authorization = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT:
      return {
        ...state,
        authorized: true,
        revoked: false,
        client: action.client
      }
    case SET_TOKEN:
      return { ...state, token: action.token }
    case REVOKE:
      return { ...state, revoked: true }
    case UNREVOKE:
      return { ...state, revoked: false }
    default:
      return state
  }
}
export default authorization

const getProp = (state, key) => {
  if (
    state.mobile &&
    state.mobile.authorization &&
    state.mobile.authorization[key] !== undefined
  ) {
    return state.mobile.authorization[key]
  }
  console.warn(`Not found authorization prop ${key}`)
  return undefined
}

export const isAuthorized = state => getProp(state, 'authorized')
export const isRevoked = state => getProp(state, 'revoked')
export const getToken = state => getProp(state, 'token')
export const getClientSettings = state => getProp(state, 'client')

export const isClientRevoked = (error, state) => {
  return (
    getServerUrl(state) &&
    (error.status === 404 ||
      error.status === 401 ||
      error.message.match(/Client has been revoked/))
  )
}
