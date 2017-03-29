import { createStore, applyMiddleware } from 'redux'
import RavenMiddleWare from 'redux-raven-middleware'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import filesApp from '../reducers'
import { ANALYTICS_URL, getAnalyticsConfiguration } from './reporter'
import { saveState } from './localStorage'

const loggerMiddleware = createLogger()
const ravenMiddleWare = RavenMiddleWare(ANALYTICS_URL, getAnalyticsConfiguration())

export const configureStore = (persistedState) => {
  const store = createStore(
    filesApp,
    persistedState,
    applyMiddleware(
      ravenMiddleWare,
      thunkMiddleware,
      loggerMiddleware
    )
  )

  store.subscribe(() => saveState({
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
