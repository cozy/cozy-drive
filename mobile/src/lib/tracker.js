/* global __PIWIK_TRACKER_URL__ __PIWIK_SITEID__ */
import { getTracker, configureTracker } from '../../../src/lib/tracker'
import { cozyAppName } from './cozy-helper'

// We'll need access to the app's router history at some point
let appHistory

export const useHistoryForTracker = (history) => {
  appHistory = history
}

export const startTracker = (cozyServerUrl = '') => {
  // start the tracker, inject the script
  const trackerInstance = getTracker(__PIWIK_TRACKER_URL__, __PIWIK_SITEID__, false, true)

  // configure the options that aren't in webpack variables
  let url = new URL(cozyServerUrl)

  configureTracker({
    userId: url.hostname || cozyServerUrl,
    app: cozyAppName
  })

  // connect to the router history if possible
  if (appHistory) {
    trackerInstance.connectToHistory(appHistory)
    trackerInstance.track(appHistory.getCurrentLocation()) // force tracking the current page
  }
}

export { resetTracker } from '../../../src/lib/tracker'
