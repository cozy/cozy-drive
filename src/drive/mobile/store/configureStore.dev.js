/* global __DEVELOPMENT__ */
import { saveState } from './persistedState'
import RavenMiddleWare from 'redux-raven-middleware'
import { createLogger } from 'redux-logger'
import { ANALYTICS_URL, getReporterConfiguration } from '../lib/reporter'
import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from 'drive/mobile/reducers'

const configureStore = (initialState = {}) => {
  const loggerMiddleware = createLogger()
  const ravenMiddleWare = RavenMiddleWare(
    ANALYTICS_URL,
    getReporterConfiguration()
  )
  const middlewares = [thunkMiddleware, ravenMiddleWare]
  middlewares.push(loggerMiddleware)

  // Enable Redux dev tools
  const composeEnhancers =
    (__DEVELOPMENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
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
