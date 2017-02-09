import { SETUP, SET_URL, SET_STATE, ERROR, UPDATE_SETTINGS } from '../actions'

const initialState = {
  isSetup: false,
  serverUrl: '',
  settings: {
    backupImages: false
  }
}

export const mobile = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state
    case SET_URL:
      return Object.assign({}, state, { serverUrl: action.url, error: null })
    case SETUP:
      return Object.assign({}, state, { isSetup: true, error: null })
    case ERROR:
      return Object.assign({}, state, { error: action.error })
    case UPDATE_SETTINGS:
      return Object.assign({}, state, Object.assign({}, state.settings, action.newSettings))
  }
  return state
}
