/* global __SENTRY_TOKEN__ */
import Raven from 'raven-js'

let send = false

export function getSentryUrl () {
  return `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`
}

export function getSentryConfiguration () {
  return {
    shouldSendCallback: (data) => send
  }
}

export function configure (value) {
  send = value
}

export function logException (err, context) {
  if (!Raven.isSetup()) {
    Raven.config(getSentryUrl(), getSentryConfiguration()).install()
  }
  Raven.captureException(err, {
    extra: context
  })
  console.groupCollapsed('Raven is recording exception')
  console.error(err)
  console.info(context)
  console.groupEnd()
}
