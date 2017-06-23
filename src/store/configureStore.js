/* global __DEVELOPMENT__ */
import { compose, createStore, applyMiddleware } from 'redux'
import { shouldEnableTracking, getTracker, createTrackerMiddleware } from 'cozy-ui/react/helpers/tracker'
import thunkMiddleware from 'redux-thunk'
import eventTrackerMiddleware from '../middlewares/EventTracker'
import { saveState, getReducers as getTargetReducers, getMiddlewares as getTargetMiddlewares } from './getTargetConfig'

const getReducers = (persistedState) => {
  let reducers = [getTargetReducers]

  if (persistedState) {
    reducers.push(persistedState)
  }

  return reducers
}

const getMiddlewares = () => {
  let middlewares = [thunkMiddleware]

  if (shouldEnableTracking() && getTracker()) {
    middlewares.push(eventTrackerMiddleware)
    middlewares.push(createTrackerMiddleware())
  }

  return middlewares.concat(getTargetMiddlewares())
}

const configureStore = (persistedState) => {
  const reducers = getReducers(persistedState)
  const middlewares = getMiddlewares()

  // Enable Redux dev tools
  const composeEnhancers = (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    ...reducers,
    composeEnhancers(applyMiddleware.apply(this, middlewares))
  )

  if (persistedState) {
    saveState(store)
  }

  return store
}

export default configureStore
