/* global __SENTRY_TOKEN__, __DEVMODE__ */
import Raven from 'raven-js'

let getState

export const ANALYTICS_URL = `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`

export function getAnalyticsConfiguration (force = false) {
  return {
    shouldSendCallback: () => getState ? getState().mobile.settings.analytics || force : false,
    environment: __DEVMODE__ ? 'development' : 'production'
  }
}

export function configureReporter (value) {
  getState = value
}

export function logException (err) {
  if (!Raven.isSetup()) {
    Raven.config(ANALYTICS_URL, getAnalyticsConfiguration()).install()
  }
  Raven.captureException(err)
  console.warn('Raven is recording exception')
  console.error(err)
}

export function logInfo (message) {
  if (!Raven.isSetup()) {
    Raven.config(ANALYTICS_URL, getAnalyticsConfiguration()).install()
  }
  Raven.captureMessage(message, {
    level: 'info'
  })
}

export function pingOnceADay () {
  if (!Raven.isSetup()) {
    Raven.config(ANALYTICS_URL, getAnalyticsConfiguration()).install()
  }
  Raven.captureMessage('good day: user opens the app', {
    level: 'info'
  })
}
