export const SET_URL = 'SET_URL'
export const BACKUP_IMAGES = 'BACKUP_IMAGES'
export const BACKUP_CONTACTS = 'BACKUP_CONTACTS'
export const WIFI_ONLY = 'WIFI_ONLY'
export const SET_ANALYTICS = 'SET_ANALYTICS'
export const SET_OFFLINE = 'SET_OFFLINE'

export const setUrl = url => ({ type: SET_URL, url })

export const setOffline = offline => ({ type: SET_OFFLINE, offline })

export const setWifiOnly = wifiOnly => ({ type: WIFI_ONLY, wifiOnly })

export const setBackupImages = backupImages => ({
  type: BACKUP_IMAGES,
  backupImages
})
