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
