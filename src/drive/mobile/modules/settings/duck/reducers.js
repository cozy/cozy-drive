import {
  SET_OFFLINE,
  SET_URL,
  BACKUP_IMAGES,
  BACKUP_CONTACTS,
  SET_ANALYTICS,
  WIFI_ONLY,
  ADD_MEDIA_BUCKET,
  DEL_MEDIA_BUCKET
} from './actions'

const initialState = {
  serverUrl: '',
  offline: false,
  analytics: false,
  backupImages: false,
  wifiOnly: true,
  mediaBuckets: new Set(['Camera'])
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
    case ADD_MEDIA_BUCKET: {
      const newMediaBuckets = new Set(
        state.mediaBuckets || initialState.mediaBuckets
      )
      newMediaBuckets.add(action.mediaBucket)
      return {
        ...state,
        mediaBuckets: newMediaBuckets
      }
    }
    case DEL_MEDIA_BUCKET: {
      const newMediaBuckets = new Set(
        state.mediaBuckets || initialState.mediaBuckets
      )
      newMediaBuckets.delete(action.mediaBucket)
      return {
        ...state,
        mediaBuckets: newMediaBuckets
      }
    }
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
export const getMediaBuckets = state =>
  getSetting(state, 'mediaBuckets') || initialState.mediaBuckets
