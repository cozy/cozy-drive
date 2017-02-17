import cozy from 'cozy-client-js'
import { initializeState } from './index'
import localforage from 'localforage'

// constants
export const SHOW_UNLINK_CONFIRMATION = 'SHOW_UNLINK_CONFIRMATION'
export const HIDE_UNLINK_CONFIRMATION = 'HIDE_UNLINK_CONFIRMATION'

// action creators sync
export const showUnlinkConfirmation = () => ({ type: SHOW_UNLINK_CONFIRMATION })
export const hideUnlinkConfirmation = () => ({ type: HIDE_UNLINK_CONFIRMATION })

// action creators async
export const unlink = () => {
  localforage.clear()
  if (cozy.offline) {
    cozy.offline.destroyDatabase('io.cozy.files')
  }
  // TODO: unregister client on Gozy
  // const client = await cozy.auth.getClient()
  // cozy.auth.unregisterClient(client)

  return initializeState()
}
