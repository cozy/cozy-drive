/* global __PIWIK_TRACKER_URL__ __PIWIK_SITEID_MOBILE__ */
import {
  getTracker,
  configureTracker,
  resetTracker
} from 'cozy-ui/transpiled/react/helpers/tracker'
import { SOFTWARE_ID } from './constants'

const mobileHeartBeatDelay = 30 // how many seconds between each hreatbeat ping to the server

// We'll need access to the app's router history at some point
let appHistory

export const useHistoryForTracker = history => {
  appHistory = history
}

export const startTracker = (cozyServerUrl = '') => {
  // start the tracker, inject the script
  const trackerInstance = getTracker(
    __PIWIK_TRACKER_URL__,
    __PIWIK_SITEID_MOBILE__,
    false,
    true
  )

  // configure the options that aren't in webpack variables
  let url = new URL(cozyServerUrl)

  configureTracker({
    userId: url.hostname || cozyServerUrl,
    app: SOFTWARE_ID,
    heartbeat: mobileHeartBeatDelay
  })

  // connect to the router history if possible
  if (appHistory && trackerInstance) {
    trackerInstance.connectToHistory(appHistory)
    trackerInstance.track(appHistory.getCurrentLocation()) // force tracking the current page
  }
}

export const stopTracker = () => {
  resetTracker()
  stopHeartBeat()
}

export const startHeartBeat = () => {
  const trackerInstance = getTracker()

  if (trackerInstance) {
    try {
      trackerInstance.push(['enableHeartBeatTimer', mobileHeartBeatDelay])
    } catch (err) {
      // logger.log(err)
    }
  }
}

export const stopHeartBeat = () => {
  const trackerInstance = getTracker()

  if (trackerInstance) {
    try {
      trackerInstance.push(['disableHeartBeatTimer']) // undocumented, see https://github.com/piwik/piwik/blob/3.x-dev/js/piwik.js#L6544
    } catch (err) {
      // logger.log(err)
    }
  }
}
