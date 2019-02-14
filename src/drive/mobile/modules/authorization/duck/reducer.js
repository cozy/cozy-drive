import {
  SET_CLIENT,
  SET_TOKEN,
  REVOKE,
  UNREVOKE,
  SET_ONBOARDING
} from './actions'

const initialState = {
  authorized: false,
  revoked: false,
  client: null,
  token: null,
  onboarding: {
    code: null,
    state: null,
    cozy_url: null
  }
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
    case SET_ONBOARDING:
      return {
        ...state,
        onboarding: {
          code: action.code,
          state: action.state,
          cozy_url: action.cozy_url
        }
      }
    default:
      return state
  }
}
export default authorization
