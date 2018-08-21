/* global __TARGET__ */
import {
  SET_CLIENT,
  SET_OFFLINE,
  SET_FIRST_REPLICATION,
  SET_POUCH_INDEXES,
  SET_URL,
  BACKUP_IMAGES,
  BACKUP_CONTACTS,
  SET_ANALYTICS,
  WIFI_ONLY,
  SET_TOKEN
} from '../actions/settings'

export const initialState = {
  offline: false,
  firstReplication: false,
  indexes: null,
  client: null,
  token: null,
  serverUrl: '',
  backupImages: false,
  // error: null,
  analytics: false,
  wifiOnly: true
}

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT:
      return {
        ...state,
        authorized: true,
        offline: true,
        client: action.client
      }
    case SET_OFFLINE:
      return { ...state, offline: action.offline }
    case SET_FIRST_REPLICATION:
      return { ...state, firstReplication: action.firstReplication }
    case SET_POUCH_INDEXES:
      return { ...state, indexes: action.indexes }
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
    case WIFI_ONLY:
      return { ...state, wifiOnly: action.wifiOnly }
    case SET_TOKEN:
      return { ...state, token: action.token }
    default:
      return state
  }
}

export default settings

export const getSetting = (state, key) => {
  if (state.mobile && state.mobile.settings && state.mobile.settings[key]) {
    return state.mobile.settings[key]
  }
  console.warn(`Not found mobile setting ${key}`)
  return undefined
}
export const getClientSettings = state => getSetting(state, 'client')
export const getToken = state => getSetting(state, 'token')
export const isOfflineCapable = state => getSetting(state, 'offline')
export const getServerUrl = state => getSetting(state, 'serverUrl')
export const isAuthorized = state => getSetting(state, 'authorized')
export const isImagesBackupOn = state => getSetting(state, 'backupImages')
export const isWifiOnlyOn = state => getSetting(state, 'wifiOnly')
export const isAnalyticsOn = state => getSetting(state, 'analytics')
export const getPouchIndexes = state => getSetting(state, 'indexes')

export const isFirstReplicationDone = state =>
  getSetting(state, 'firstReplication')

export const shouldWorkFromPouchDB = state =>
  __TARGET__ === 'mobile' &&
  isOfflineCapable(state) &&
  isFirstReplicationDone(state) &&
  getPouchIndexes(state)
