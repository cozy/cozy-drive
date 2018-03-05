/* global __SENTRY_TOKEN__, __DEVELOPMENT__, __APP_VERSION__ */
import Raven from 'raven-js'

export const ANALYTICS_URL =
  typeof __SENTRY_TOKEN__ === 'undefined'
    ? ''
    : `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/6`

export const getReporterConfiguration = () => ({
  shouldSendCallback: true,
  environment: __DEVELOPMENT__ ? 'development' : 'production',
  release: __APP_VERSION__,
  allowSecretKey: true
})

export const configureReporter = () => {
  Raven.config(ANALYTICS_URL, getReporterConfiguration()).install()
}

export const logException = (err, extraContext = null, fingerprint = null) => {
  return new Promise(resolve => {
    Raven.captureException(err, { extra: extraContext, fingerprint })
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
