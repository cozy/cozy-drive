/* global __SENTRY_TOKEN__ */
import Raven from 'raven-js'

export function logException (err, context) {
  if (!Raven.isSetup()) {
    Raven.config(`https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`).install()
  }
  Raven.captureException(err, {
    extra: context
  })
  console.groupCollapsed('Raven is recording exception')
  console.error(err)
  console.info(context)
  console.groupEnd()
}
