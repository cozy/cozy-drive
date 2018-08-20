import { SET_CLIENT } from '../../actions/settings'

export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES = 'BACKUP_IMAGES'
export const BACKUP_CONTACTS = 'BACKUP_CONTACTS'
export const WIFI_ONLY = 'WIFI_ONLY'
// export const ERROR = 'ERROR'
export const SET_ANALYTICS = 'SET_ANALYTICS'
export const SET_TOKEN = 'SET_TOKEN'

export const initialState = {
  serverUrl: '',
  backupImages: false,
  // error: null,
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
    // case ERROR:
    //   return { ...state, error: action.error }
    case SET_CLIENT:
      return { ...state, authorized: true }
    case WIFI_ONLY:
      return { ...state, wifiOnly: action.wifiOnly }
    case SET_TOKEN:
      return { ...state, token: action.token }
    default:
      return state
  }
}

export default settings

export const getServerUrl = state =>
  state.mobile && state.mobile.settings && state.mobile.settings.serverUrl
export const isAuthorized = state =>
  state.mobile && state.mobile.settings && state.mobile.settings.authorized
export const isImagesBackupOn = state =>
  state.mobile && state.mobile.settings && state.mobile.settings.backupImages
export const isWifiOnlyOn = state =>
  state.mobile && state.mobile.settings && state.mobile.settings.wifiOnly
export const isAnalyticsOn = state =>
  state.mobile && state.mobile.settings && state.mobile.settings.analytics
