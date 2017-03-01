import { INIT_STATE } from '../actions'
import { SET_URL, ERROR, BACKUP_IMAGES_DISABLE, BACKUP_IMAGES_ENABLE, SET_CLIENT } from '../actions/settings'

export const initialState = {
  serverUrl: '',
  backupImages: false,
  error: null
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return { ...state, serverUrl: action.url, error: null, authorized: false }
    case BACKUP_IMAGES_DISABLE:
      return { ...state, backupImages: false }
    case BACKUP_IMAGES_ENABLE:
      return { ...state, backupImages: true }
    case ERROR:
      return { ...state, error: action.error }
    case INIT_STATE:
      return initialState
    case SET_CLIENT:
      return { ...state, client: action.client, authorized: true }
    default:
      return state
  }
}

export default settings
