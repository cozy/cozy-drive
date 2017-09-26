import { getTracker } from 'cozy-ui/react/helpers/tracker'

export const track = element => {
  const tracker = getTracker()
  tracker &&
    tracker.push(['trackEvent', 'interaction', 'desktop-prompt', element])
}

export const DESKTOP_BANNER = 'desktop_banner'
