import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import {
  Routes,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from 'react-router-dom'

import appMetadata from 'lib/appMetadata'

Sentry.init({
  dsn: 'https://05f3392b39bb4504a179c95aa5b0e8f6@errors.cozycloud.cc/41',
  environment: process.env.NODE_ENV,
  release: appMetadata.version,
  integrations: [
    // We also want to capture the `console.error` to, among other things,
    // report the logs present in the `try/catch
    Sentry.captureConsoleIntegration({ levels: ['error'] }),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes
    })
  ],
  tracesSampleRate: 0.1,
  // React log these warnings(bad Proptypes), in a console.error,
  // it is not relevant to report this type of information to Sentry
  ignoreErrors: [/^Warning: /]
})

export const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)
