import { createStore, applyMiddleware } from 'redux'
import RavenMiddleWare from 'redux-raven-middleware'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import filesApp from '../reducers'
import { ANALYTICS_URL, getAnalyticsConfiguration } from './reporter'
import { saveState } from './localStorage'

const loggerMiddleware = createLogger()

export const getStore = (persistedState) => {
  let store = createStore(
    filesApp,
    persistedState,
    applyMiddleware(
      RavenMiddleWare(ANALYTICS_URL, getAnalyticsConfiguration()),
      thunkMiddleware,
      loggerMiddleware
    )
  )

  store.subscribe(() => saveState({
    mobile: {
      settings: store.getState().mobile.settings,
      mediaBackup: {
        uploaded: store.getState().mobile.mediaBackup.uploaded
      }
    }
  }))

  return store
}
