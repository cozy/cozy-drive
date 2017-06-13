/* global __DEVELOPMENT__ */
import getReducers from '../../mobile/src/reducers'
import { saveState as savePersistedState } from './persistedState'
import RavenMiddleWare from 'redux-raven-middleware'
import { ANALYTICS_URL, getConfig as getAnalyticsConfiguration } from '../../mobile/src/lib/reporter'

const saveState = store => {
  store.subscribe(() => savePersistedState({
    settings: store.getState().settings,
    mobile: {
      timestamp: store.getState().mobile.timestamp,
      settings: store.getState().mobile.settings,
      mediaBackup: {
        uploaded: store.getState().mobile.mediaBackup.uploaded
      }
    }
  }))
}

const ravenMiddleWare = RavenMiddleWare(ANALYTICS_URL, getAnalyticsConfiguration())

const getMiddlewares = () => {
  let middlewares = [
    ravenMiddleWare
  ]

  return middlewares
}

export { getReducers, saveState, getMiddlewares }
