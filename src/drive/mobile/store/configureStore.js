/* global __DEVELOPMENT__ */
import { saveState } from './persistedState'
import RavenMiddleWare from 'redux-raven-middleware'
import { createLogger } from 'redux-logger'
import { ANALYTICS_URL, getConfig as getAnalyticsConfiguration } from '../lib/reporter'
import { compose, createStore, applyMiddleware } from 'redux'
import { shouldEnableTracking, getTracker, createTrackerMiddleware } from 'cozy-ui/react/helpers/tracker'
import thunkMiddleware from 'redux-thunk'
import eventTrackerMiddleware from 'drive/middlewares/EventTracker'
import rootReducer from 'drive/mobile/reducers'

const configureStore = (initialState = {}) => {
  const loggerOptions = __DEVELOPMENT__ ? {} : {
    level: {
      prevState: false,
      nextState: false
    }
  }
  const loggerMiddleware = createLogger(loggerOptions)
  const ravenMiddleWare = RavenMiddleWare(ANALYTICS_URL, getAnalyticsConfiguration())
  const middlewares = [
    thunkMiddleware,
    ravenMiddleWare
  ]
  if (shouldEnableTracking() && getTracker()) {
    middlewares.push(eventTrackerMiddleware)
    middlewares.push(createTrackerMiddleware())
  }
  middlewares.push(loggerMiddleware)

  // Enable Redux dev tools
  const composeEnhancers = (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  store.subscribe(() => saveState({
    settings: store.getState().settings,
    mobile: {
      timestamp: store.getState().mobile.timestamp,
      settings: store.getState().mobile.settings,
      mediaBackup: {
        uploaded: store.getState().mobile.mediaBackup.uploaded
      }
    },
    availableOffline: store.getState().availableOffline
  }))

  return store
}

export default configureStore
