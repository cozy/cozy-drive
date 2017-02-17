import {
  ERROR,
  SET_URL, BACKUP_IMAGES_DISABLE, BACKUP_IMAGES_ENABLE,
  INIT_STATE
} from '../actions'

export const initialState = {
  serverUrl: '',
  backupImages: false,
  error: null
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return { ...state, serverUrl: action.url, error: null }
    case BACKUP_IMAGES_DISABLE:
      return { ...state, backupImages: false }
    case BACKUP_IMAGES_ENABLE:
      return { ...state, backupImages: true }
    case ERROR:
      return { ...state, error: action.error }
    case INIT_STATE:
      return initialState
    default:
      return state
  }
}

export default settings
