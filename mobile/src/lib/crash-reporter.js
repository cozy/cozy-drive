/* global __SENTRY_TOKEN__ */
import Raven from 'raven-js'

let getState

export const ANALYTIC_URL = `https://${__SENTRY_TOKEN__}@sentry.cozycloud.cc/2`

export function getAnalyticConfiguration () {
  return {
    shouldSendCallback: () => getState().mobile.mobile.settings.analytic
  }
}

export function configureReporter (value) {
  getState = value
}

export function logException (err, context) {
  if (!Raven.isSetup()) {
    Raven.config(ANALYTIC_URL, getAnalyticConfiguration()).install()
  }
  Raven.captureException(err, {
    extra: context
  })
  console.groupCollapsed('Raven is recording exception')
  console.error(err)
  console.info(context)
  console.groupEnd()
}
