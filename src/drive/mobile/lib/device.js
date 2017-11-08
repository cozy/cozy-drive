// platform
export const isCordova = () => window.cordova !== undefined
export const getPlatformId = () =>
  isCordova() ? window.cordova.platformId : undefined
const isPlatform = platform => getPlatformId() === platform
export const isIos = () => isPlatform('ios')
export const isAndroid = () => isPlatform('android')

// device
const hasCordovaDeviceNamePlugin = () =>
  isCordova() && window.cordova.plugins.deviceName !== undefined
export const getDeviceName = () =>
  hasCordovaDeviceNamePlugin()
    ? window.cordova.plugins.deviceName.name
    : undefined
