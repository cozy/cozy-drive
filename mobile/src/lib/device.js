export const isCordova = () => window.cordova !== undefined
export const getPlatformId = () => isCordova() ? window.cordova.platformId : undefined
const isPlatform = platform => getPlatformId() === platform
export const isIos = () => isPlatform('ios')
export const isAndroid = () => isPlatform('android')
