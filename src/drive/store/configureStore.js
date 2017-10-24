/* global __DEVELOPMENT__ */
import { compose, createStore, applyMiddleware } from 'redux'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/react/helpers/tracker'
import { cozyMiddleware } from 'cozy-client'
import thunkMiddleware from 'redux-thunk'
import eventTrackerMiddleware from '../middlewares/EventTracker'
import rootReducer from '../reducers'
import logger from 'redux-logger'

const configureStore = (client, initialState = {}) => {
  const middlewares = [cozyMiddleware(client), thunkMiddleware]
  if (shouldEnableTracking() && getTracker()) {
    middlewares.push(eventTrackerMiddleware)
    middlewares.push(createTrackerMiddleware())
  }
  if (__DEVELOPMENT__) {
    middlewares.push(logger)
  }

  // Enable Redux dev tools
  const composeEnhancers =
    (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  return store
}

export default configureStore
