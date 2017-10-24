import { saveState } from './persistedState'
import RavenMiddleWare from 'redux-raven-middleware'
import { createLogger } from 'redux-logger'
import { ANALYTICS_URL, getReporterConfiguration } from '../lib/reporter'
import { compose, createStore, applyMiddleware } from 'redux'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/react/helpers/tracker'
import thunkMiddleware from 'redux-thunk'
import eventTrackerMiddleware from 'drive/middlewares/EventTracker'
import rootReducer from 'drive/mobile/reducers'

const configureStore = (initialState = {}) => {
  const loggerOptions = {
    level: {
      prevState: false,
      nextState: false
    }
  }
  const loggerMiddleware = createLogger(loggerOptions)
  const ravenMiddleWare = RavenMiddleWare(
    ANALYTICS_URL,
    getReporterConfiguration()
  )
  const middlewares = [thunkMiddleware, ravenMiddleWare]
  if (shouldEnableTracking() && getTracker()) {
    middlewares.push(eventTrackerMiddleware)
    middlewares.push(createTrackerMiddleware())
  }
  middlewares.push(loggerMiddleware)

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  )

  store.subscribe(() =>
    saveState({
      settings: store.getState().settings,
      mobile: {
        settings: store.getState().mobile.settings,
        mediaBackup: {
          uploaded: store.getState().mobile.mediaBackup.uploaded
        }
      },
      availableOffline: store.getState().availableOffline
    })
  )

  return store
}

export default configureStore
