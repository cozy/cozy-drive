/* global __DEVELOPMENT__, __TARGET__ */
import { compose, createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import RavenMiddleWare from 'redux-raven-middleware'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/react/helpers/tracker'
import thunkMiddleware from 'redux-thunk'
import eventTrackerMiddleware from './middlewares/EventTracker'
import createRootReducer from './rootReducer'
import { saveState } from './persistedState'
import {
  ANALYTICS_URL,
  getReporterConfiguration
} from 'drive/mobile/lib/reporter'

const configureStore = (client, t, initialState = {}) => {
  const middlewares = [thunkMiddleware.withExtraArgument({ client, t })]
  if (__TARGET__ === 'mobile') {
    middlewares.push(RavenMiddleWare(ANALYTICS_URL, getReporterConfiguration()))
  }
  if (shouldEnableTracking() && getTracker()) {
    middlewares.push(eventTrackerMiddleware)
    middlewares.push(createTrackerMiddleware())
  }
  middlewares.push(createLogger(loggerOptions()))

  // Enable Redux dev tools
  const composeEnhancers =
    (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const rootReducer = createRootReducer(client)

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  if (__TARGET__ === 'mobile') {
    store.subscribe(() =>
      saveState({
        mobile: {
          authorization: store.getState().mobile.authorization,
          settings: store.getState().mobile.settings,
          replication: store.getState().mobile.replication,
          mediaBackup: {
            uploaded: store.getState().mobile.mediaBackup.uploaded
          }
        },
        availableOffline: store.getState().availableOffline
      })
    )
  }

  client.setStore(store)

  return store
}

const loggerOptions = () =>
  __DEVELOPMENT__
    ? {}
    : {
        level: {
          prevState: false,
          nextState: false
        }
      }

export default configureStore
