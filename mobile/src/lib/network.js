export const UNKNOWN = window.Connection ? window.Connection.UNKNOWN : 'unknown'
export const ETHERNET = window.Connection ? window.Connection.ETHERNET : 'ethernet'
export const WIFI = window.Connection ? window.Connection.WIFI : 'wifi'
export const CELL_2G = window.Connection ? window.Connection.CELL_2G : '2g'
export const CELL_3G = window.Connection ? window.Connection.CELL_3G : '3g'
export const CELL_4G = window.Connection ? window.Connection.CELL_4G : '4g'
export const CELL = window.Connection ? window.Connection.CELL : 'cellular'
export const NONE = window.Connection ? window.Connection.NONE : 'none'

export const watchNetworkState = (onConnectionChange) => {
  document.addEventListener('offline', onConnectionChange, false)
  document.addEventListener('online', onConnectionChange, false)
}

const hasCordovaPlugin = () => window.navigator.connection !== undefined && window.Connection !== undefined

export const getConnectionType = () => hasCordovaPlugin() ? navigator.connection.type : WIFI

export const onWifi = connection => connection === WIFI

export const backupAllowed = (wifiOnly) => onWifi(getConnectionType()) || !wifiOnly
export const isOnline = () => hasCordovaPlugin() ? navigator.connection !== NONE : navigator.onLine
