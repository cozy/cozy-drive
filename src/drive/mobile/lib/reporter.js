/* global __SENTRY_TOKEN__, __DEVELOPMENT__ */
import Raven from 'raven-js'

let isEnabled = false

const getAnalyticsUrl = () => {
  if (typeof __SENTRY_TOKEN__ === 'undefined') {
    return ''
  }

  const PROD_ANALYTICS_URL = `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/6`
  const DEV_ANALYTICS_URL = `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`
  return __DEVELOPMENT__ ? DEV_ANALYTICS_URL : PROD_ANALYTICS_URL
}

export const ANALYTICS_URL = getAnalyticsUrl()

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

const logMessage = (message, serverUrl, level = 'info', force) => {
  return new Promise(resolve => {
    if (force) {
      configureReporter(true)
    }
    Raven.setUserContext = {
      url: serverUrl
    }
    Raven.captureMessage(`[${serverUrl}] ${message}`, {
      level
    })
    if (force) {
      configureReporter(isEnabled)
    }
    resolve()
  })
}

export const logInfo = (message, serverUrl, force = false) =>
  logMessage(message, serverUrl, 'info', force)
