/* global __DEVELOPMENT__ */
import createLogger from 'redux-logger'
import getReducers from '../reducers'

const persistState = (store) => {
  // no persiste state on browser
}

const getMiddlewares = () => {
  let middlewares = []

  if (__DEVELOPMENT__) {
    // must be the last middleware in chain https://git.io/vHQpt
    const loggerMiddleware = createLogger()
    middlewares.push(loggerMiddleware)
  }

  return middlewares
}

export { getReducers, persistState, getMiddlewares }
