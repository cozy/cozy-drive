/* global __DEVELOPMENT__, __TARGET__ */
import { compose, createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import RavenMiddleWare from 'redux-raven-middleware'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/react/helpers/tracker'
import { cozyMiddleware } from 'cozy-client'
import thunkMiddleware from 'redux-thunk'
import eventTrackerMiddleware from '../middlewares/EventTracker'
import rootReducer from '../reducers'
import mobileRootReducer from '../mobile/reducers'
import { saveState } from './persistedState'
import { ANALYTICS_URL, getReporterConfiguration } from '../mobile/lib/reporter'

const configureStore = (client, initialState = {}) => {
  const middlewares = [cozyMiddleware(client), thunkMiddleware]
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

  const store = createStore(
    __TARGET__ === 'mobile' ? mobileRootReducer : rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  if (__TARGET__ === 'mobile') {
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
  }

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
