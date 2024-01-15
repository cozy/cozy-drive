/* global __SENTRY_URL__, __DEVELOPMENT__ */
import Raven from 'raven-js'

import appMetadata from 'lib/appMetadata'
import logger from 'lib/logger'

export const ANALYTICS_URL =
  typeof __SENTRY_URL__ === 'undefined' ? '' : __SENTRY_URL__

// normalize files path on mobile, see https://github.com/getsentry/sentry-cordova/blob/17e8b3395e8ce391ecf28658d0487b97487bb509/src/js/SentryCordova.ts#L213
const normalizeUrl = (url, pathStripRe) =>
  url.replace(/^file:\/\//, 'app://').replace(pathStripRe, '')

export const normalizeData = data => {
  const PATH_STRIP_RE = /^.*\/[^.]+(\.app|CodePush|.*(?=\/))/

  if (data.culprit) {
    data.culprit = normalizeUrl(data.culprit, PATH_STRIP_RE)
  }
  const stacktrace =
    data.stacktrace ||
    (data.exception &&
      data.exception.values &&
      data.exception.values[0] &&
      data.exception.values[0].stacktrace)

  if (stacktrace) {
    stacktrace.frames = stacktrace.frames.map(frame =>
      frame.filename !== '[native code]'
        ? { ...frame, filename: normalizeUrl(frame.filename, PATH_STRIP_RE) }
        : frame
    )
  }
  return data
}

export const getReporterConfiguration = () => ({
  shouldSendCallback: true,
  environment: __DEVELOPMENT__ ? 'development' : 'production',
  release: appMetadata.version,
  allowSecretKey: true,
  dataCallback: normalizeData
})

export const configureReporter = () => {
  Raven.config(ANALYTICS_URL, getReporterConfiguration()).install()
}

export const logException = (err, extraContext = null, fingerprint = null) => {
  return new Promise(resolve => {
    Raven.captureException(err, { extra: extraContext, fingerprint })
    logger.warn('Raven is recording exception')
    logger.error(err)
    resolve()
  })
}

export const setCozyUrl = instance => {
  Raven.setTagsContext({ instance })
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
