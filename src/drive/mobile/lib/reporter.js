/* global __SENTRY_TOKEN__, __DEVELOPMENT__ */
import Raven from 'raven-js'

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
  shouldSendCallback: true,
  environment: __DEVELOPMENT__ ? 'development' : 'production'
})

export const configureReporter = () => {
  Raven.config(ANALYTICS_URL, getReporterConfiguration()).install()
}

export const logException = (err, extraContext = null) => {
  return new Promise(resolve => {
    extraContext
      ? Raven.captureException(err, { extra: extraContext })
      : Raven.captureException(err)
    console.warn('Raven is recording exception')
    console.error(err)
    resolve()
  })
}

const logMessage = (message, serverUrl, level = 'info') => {
  return new Promise(resolve => {
    Raven.setUserContext = {
      url: serverUrl
    }
    Raven.captureMessage(`[${serverUrl}] ${message}`, {
      level
    })
    resolve()
  })
}

export const logInfo = (message, serverUrl) =>
  logMessage(message, serverUrl, 'info')
