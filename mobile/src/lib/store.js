import { createStore, applyMiddleware } from 'redux'
import RavenMiddleWare from 'redux-raven-middleware'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import eventTrackerMiddleware from '../../../src/middlewares/EventTracker'
import { createTrackerMiddleware } from '../../../src/lib/tracker'

import filesApp from '../reducers'
import { ANALYTICS_URL, getConfig as getAnalyticsConfiguration } from './reporter'
import { saveState } from './localStorage'

const loggerMiddleware = createLogger()
const ravenMiddleWare = RavenMiddleWare(ANALYTICS_URL, getAnalyticsConfiguration())
const trackerMiddleware = createTrackerMiddleware()

export const configureStore = (persistedState) => {
  const store = createStore(
    filesApp,
    persistedState,
    applyMiddleware(
      ravenMiddleWare,
      thunkMiddleware,
      loggerMiddleware,
      eventTrackerMiddleware,
      trackerMiddleware
    )
  )

  store.subscribe(() => saveState({
    settings: store.getState().settings,
    mobile: {
      timestamp: store.getState().mobile.timestamp,
      settings: store.getState().mobile.settings,
      mediaBackup: {
        uploaded: store.getState().mobile.mediaBackup.uploaded
      }
    }
  }))

  return store
}
