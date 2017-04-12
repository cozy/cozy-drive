import { configureReporter } from './reporter'
import { initClient, initBar, isClientRegistered } from './cozy-helper'
import { revokeClient } from '../actions/authorization'
import { startReplication } from '../actions/settings'

export const initServices = (store) => {
  configureReporter(store.getState)
  initClient(store.getState().mobile.settings.serverUrl)

  const client = store.getState().settings.client
  if (client) {
    isClientRegistered(client)
      .then((clientIsRegistered) => {
        if (clientIsRegistered) {
          startReplication(store.dispatch, store.getState) // don't like to pass `store.dispatch` and `store.getState` as parameters, big coupling
          initBar()
        } else {
          console.warn('Your device is no more connected to your server')
          store.dispatch(revokeClient())
        }
      })
  }
}
