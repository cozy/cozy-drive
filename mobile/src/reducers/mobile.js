import {
  SET_URL, SET_STATE, INITIALIZE_STATE, ERROR, UPDATE_SETTINGS,
  SHOW_UNLINK_CONFIRMATION, HIDE_UNLINK_CONFIRMATION
} from '../actions'

export const initialState = {
  settings: {
    serverUrl: '',
    backupImages: false,
    displayUnlinkConfirmation: false
  }
}

export const mobile = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state
    case INITIALIZE_STATE:
      return initialState
    case SET_URL:
      return { ...state, settings: { serverUrl: action.url }, error: null }
    case ERROR:
      return { ...state, error: action.error }
    case UPDATE_SETTINGS:
      return { ...state, settings: Object.assign({}, state.settings, action.newSettings) }
    case SHOW_UNLINK_CONFIRMATION:
      return { ...state, settings: { displayUnlinkConfirmation: true } }
    case HIDE_UNLINK_CONFIRMATION:
      return { ...state, settings: { displayUnlinkConfirmation: false } }
  }
  return state
}
