export const isCordova = () => window.cordova !== undefined
export const getDeviceName = () => isCordova() ? window.cordova.platformId : undefined
const isPlatform = platform => getDeviceName() === platform
export const isIos = () => isPlatform('ios')
export const isAndroid = () => isPlatform('android')
