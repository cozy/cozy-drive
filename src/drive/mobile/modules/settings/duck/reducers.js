import {
  SET_OFFLINE,
  SET_URL,
  BACKUP_IMAGES,
  BACKUP_CONTACTS,
  SET_ANALYTICS,
  WIFI_ONLY
} from './actions'

const initialState = {
  serverUrl: '',
  offline: false,
  analytics: false,
  backupImages: false,
  wifiOnly: true
}

const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return { ...state, serverUrl: action.url }
    case SET_OFFLINE:
      return { ...state, offline: action.offline }
    case SET_ANALYTICS:
      return { ...state, analytics: action.analytics }
    case BACKUP_IMAGES:
      return { ...state, backupImages: action.backupImages }
    case BACKUP_CONTACTS:
      return { ...state, backupContacts: action.backupContacts }
    case WIFI_ONLY:
      return { ...state, wifiOnly: action.wifiOnly }
    default:
      return state
  }
}

export default settings

const getSetting = (state, key) => {
  if (
    state.mobile &&
    state.mobile.settings &&
    state.mobile.settings[key] !== undefined
  ) {
    return state.mobile.settings[key]
  }
  return undefined
}

export const getServerUrl = state => getSetting(state, 'serverUrl')
export const isOfflineCapable = state => getSetting(state, 'offline')
export const isImagesBackupOn = state => getSetting(state, 'backupImages')
export const isWifiOnlyOn = state => getSetting(state, 'wifiOnly')
export const isAnalyticsOn = state => getSetting(state, 'analytics')
