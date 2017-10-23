/* global __SENTRY_TOKEN__, __DEVELOPMENT__ */
import Raven from 'raven-js'

let isEnabled = false
const PROD_ANALYTICS_URL = `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/6`
const DEV_ANALYTICS_URL = `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`
export const ANALYTICS_URL = __DEVELOPMENT__
  ? DEV_ANALYTICS_URL
  : PROD_ANALYTICS_URL

export const getReporterConfiguration = () => ({
  shouldSendCallback: () => isEnabled,
  environment: __DEVELOPMENT__ ? 'development' : 'production'
})

export const configureReporter = enable => {
  isEnabled = enable
  Raven.config(ANALYTICS_URL, getReporterConfiguration()).install()
}

export const logException = err => {
  return new Promise(resolve => {
    Raven.captureException(err)
    console.warn('Raven is recording exception')
    console.error(err)
    resolve()
  })
}

const logMessage = (message, level = 'info', force) => {
  return new Promise(resolve => {
    if (force) {
      configureReporter(true)
    }
    Raven.captureMessage(message, {
      level
    })
    if (force) {
      configureReporter(isEnabled)
    }
    resolve()
  })
}

export const logInfo = (message, force = false) =>
  logMessage(message, 'info', force)
