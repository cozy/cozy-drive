export const watchNetworkState = (onConnectionChange) => {
  document.addEventListener('offline', onConnectionChange, false)
  document.addEventListener('online', onConnectionChange, false)
}

export const hasCordovaPlugin = window.navigator.connection !== undefined && window.Connection !== undefined

export const getConnectionType = () => hasCordovaPlugin ? navigator.connection.type : 'wifi'

export const onWifi = connection => connection === 'wifi'

export const backupAllowed = (connectionType, wifiOnly) => onWifi(connectionType) || !wifiOnly
