import { configureReporter } from './crash-reporter'
import { initClient } from './cozy-helper'

export const initService = (store) => {
  configureReporter(store.getState)
  initClient(store.getState().mobile.settings.serverUrl)
}
