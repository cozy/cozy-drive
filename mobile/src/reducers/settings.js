import { INIT_STATE } from '../actions'
import { SET_URL, ERROR, BACKUP_IMAGES, SET_CLIENT, WIFI_ONLY } from '../actions/settings'

export const initialState = {
  serverUrl: '',
  backupImages: false,
  error: null,
  wifiOnly: true
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return { ...state, serverUrl: action.url, error: null, authorized: false }
    case BACKUP_IMAGES:
      return { ...state, backupImages: action.value }
    case ERROR:
      return { ...state, error: action.error }
    case INIT_STATE:
      return initialState
    case SET_CLIENT:
      return { ...state, client: action.client, authorized: true }
    case WIFI_ONLY:
      return { ...state, wifiOnly: action.value }
    default:
      return state
  }
}

export default settings
