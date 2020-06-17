/* global __DEVELOPMENT__, __TARGET__ */
import { compose, createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import RavenMiddleWare from 'redux-raven-middleware'
import {
  shouldEnableTracking,
  getTracker,
  createTrackerMiddleware
} from 'cozy-ui/transpiled/react/helpers/tracker'
import thunkMiddleware from 'redux-thunk'
import createRootReducer from './rootReducer'
import { saveState } from './persistedState'
import { ANALYTICS_URL, getReporterConfiguration } from 'drive/lib/reporter'
import { connectStoreToHistory } from './connectedRouter'

/**
 * Creates the redux store
 *
 * Contains cozy-client's state and router state
 *
 * @param  {Object} options Options
 * @param  {Object} options.client CozyClient
 * @param  {Object} options.t Polygot t function
 * @param  {Object} options.history History
 *
 * @return {ReduxStore}
 */
const configureStore = options => {
  const { client, t, initialState = {}, history } = options

  const middlewares = [thunkMiddleware.withExtraArgument({ client, t })]
  if (__TARGET__ === 'mobile') {
    middlewares.push(RavenMiddleWare(ANALYTICS_URL, getReporterConfiguration()))
  }
  if (shouldEnableTracking() && getTracker()) {
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

  if (history) {
    connectStoreToHistory(store, history)
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
