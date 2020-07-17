export const track = jest.fn()

export const isLinux = jest.fn()
export const isAndroid = jest.fn()
export const isIOS = jest.fn()

export const DESKTOP_BANNER = 'desktop_banner'
export const NOVIEWER_DESKTOP_CTA = 'noviewer_desktop_cta'

export const isClientAlreadyInstalled = jest.fn().mockResolvedValue(false)
