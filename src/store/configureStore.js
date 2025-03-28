import { compose, createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import flag from 'cozy-flags'

import createRootReducer from './rootReducer'

/**
 * Creates the redux store
 *
 * Contains cozy-client's state and router state
 *
 * @param  {Object} options Options
 * @param  {Object} options.client CozyClient
 * @param  {Object} options.t Polygot t function
 *
 * @return {ReduxStore}
 */
const configureStore = options => {
  const { client, t, initialState = {}, setStoreToClient = true } = options

  const middlewares = [thunkMiddleware.withExtraArgument({ client, t })]

  if (flag('drive.logger')) {
    middlewares.push(createLogger(loggerOptions()))
  }

  // Enable Redux dev tools
  const composeEnhancers =
    (flag('debug') && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const rootReducer = createRootReducer(client)

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  if (setStoreToClient) {
    client.setStore(store)
  }

  return store
}

const loggerOptions = () =>
  flag('debug')
    ? {}
    : {
        level: {
          prevState: false,
          nextState: false
        }
      }

export default configureStore
