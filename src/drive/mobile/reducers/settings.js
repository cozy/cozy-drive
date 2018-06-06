import { SET_CLIENT } from '../../actions/settings'
import {
  SET_URL,
  ERROR,
  BACKUP_IMAGES,
  BACKUP_CONTACTS,
  SET_ANALYTICS,
  WIFI_ONLY,
  SET_TOKEN
} from '../actions/settings'
import { UNLINK } from '../actions/unlink'

export const initialState = {
  serverUrl: '',
  backupImages: false,
  error: null,
  analytics: false,
  wifiOnly: true
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return { ...state, serverUrl: action.url, error: null, authorized: false }
    case BACKUP_IMAGES:
      return { ...state, backupImages: action.backupImages }
    case BACKUP_CONTACTS:
      return { ...state, backupContacts: action.backupContacts }
    case SET_ANALYTICS:
      return { ...state, analytics: action.analytics }
    case ERROR:
      return { ...state, error: action.error }
    case SET_CLIENT:
      return { ...state, authorized: true }
    case WIFI_ONLY:
      return { ...state, wifiOnly: action.wifiOnly }
    case SET_TOKEN:
      return { ...state, token: action.token }
    case UNLINK:
      return initialState
    default:
      return state
  }
}

export default settings
