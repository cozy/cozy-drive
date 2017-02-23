/* global cozy */

import { initializeState } from '.'
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
  if (cozy.client.offline.destroyDatabase) {
    cozy.client.offline.destroyDatabase('io.cozy.files')
  }
  // TODO: unregister client on Gozy
  // const client = await cozy.client.auth.getClient()
  // cozy.client.auth.unregisterClient(client)

  return initializeState()
}
