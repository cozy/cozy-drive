import { getTracker } from 'cozy-ui/react/helpers/tracker'

export const track = element => {
  const tracker = getTracker()
  tracker &&
    tracker.push(['trackEvent', 'interaction', 'desktop-prompt', element])
}

export const isLinux = () =>
  window.navigator &&
  (window.navigator.appVersion.indexOf('Win') === -1 &&
    window.navigator.appVersion.indexOf('Mac') === -1)
export const isAndroid = () =>
  window.navigator.userAgent &&
  window.navigator.userAgent.indexOf('Android') >= 0
export const isIOS = () =>
  window.navigator.userAgent &&
  /iPad|iPhone|iPod/.test(window.navigator.userAgent)

export const DESKTOP_BANNER = 'desktop_banner'
