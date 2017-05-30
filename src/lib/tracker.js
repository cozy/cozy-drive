/* global __PIWIK_TRACKER_URL__ __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */
/* global cozy */

let trackerInstance = null

// SIngleton class
export default class Tracker {
  /**
   * Tries to detect if tracking should be enabled or not, based on a `cozyTracking` attribute in the root dataset.
   * @returns {boolean} Undefined if it can't find the information, true/false otherwise.
   */
  static shouldEnableTracking () {
    const root = document.querySelector('[role=application]')

    if (root && root.dataset) {
      let track = root.dataset.cozyTracking

      if (track === '' || track === 'true') return true
      else if (track === 'false') return false
    }

    return undefined;
  }
  /**
   * Returns the instance of the piwik tracker, creating it on thee fly if required. All parameters are optionnal.
   * @param   {string} trackerUrl                    The URL of the piwik instance, without the php file name
   * @param   {number} siteId                        The siteId to use for piwik
   * @param   {boolean} automaticallyConfigure = true Pass false to skip the automatic configuration
   * @returns {object} An instance of `PiwikReactRouter` on success, null if the creation fails (usually because of adblockers)
   */
  static getTracker (trackerUrl, siteId, automaticallyConfigure = true) {
    if (trackerInstance !== null) return trackerInstance

    try {
      var PiwikReactRouter = require('piwik-react-router')

      trackerInstance = (Piwik.getTracker(), PiwikReactRouter({
        url: trackerUrl || __PIWIK_TRACKER_URL__,
        siteId: siteId || __PIWIK_SITEID__, // site id is required here
        injectScript: false
      }))

      // apply the default configuration
      if (automaticallyConfigure) Tracker.configureTracker()

      return trackerInstance
    }
    catch (err) {
      //this usually happens when there's an ad blocker
      console.warn(err)
      trackerInstance = null
      return null
    }
  }
  /**
   * Configures the base options for the tracker which will persist during the session.
   * @param   {object} options A map of options that can be configured.
   *          {string} options.userId
   *          {number} options.appDimensionId
   *          {string} options.app
   *          {boolean} options.heartbeat
   */
  static configureTracker (options = {}) {
    // early out in case the tracker is not available
    if (trackerInstance === null) {
      // maybe we should throw an error here?
      return
    }

    // compute the default values for options
    let userId
    let appName

    const root = document.querySelector('[role=application]')
    if (root && root.dataset) {
      appName = root.dataset.cozyAppName
      userId = root.dataset.cozyDomain || ''

      let indexOfPort = userId.indexOf(':')
      if (indexOfPort >= 0) userId = userId.substring(0, indexOfPort)
    }

    //merge default options with what has been provided
    options = Object.assign({
      userId: userId,
      appDimensionId: __PIWIK_DIMENSION_ID_APP__,
      app: appName,
      heartbeat: true
    }, options)

    //apply them
    if (options.heartbeat) trackerInstance.push(['enableHeartBeatTimer'])
    trackerInstance.push(['setUserId', options.userId])
    trackerInstance.push(['setCustomDimension', options.appDimensionId, options.app])
  }
  /**
   * Returns a new middleware for redux, which will track events if the action has an `trackEvent` field, containing at least `category` and `action` fields.
   * @returns {function}
   */
  static createMiddleware () {
    return store => next => action => {
      if (action.trackEvent && action.trackEvent.category && action.trackEvent.action)  {
        trackerInstance.push(['trackEvent', action.trackEvent.category, action.trackEvent.action, action.trackEvent.name, action.trackEvent.value])
      }

      return next(action)
    }
  }
}
