import { resetClient } from '../lib/cozy-helper'

// constants
export const SHOW_UNLINK_CONFIRMATION = 'SHOW_UNLINK_CONFIRMATION'
export const HIDE_UNLINK_CONFIRMATION = 'HIDE_UNLINK_CONFIRMATION'
export const UNLINK = 'UNLINK'

// action creators sync
export const showUnlinkConfirmation = () => ({ type: SHOW_UNLINK_CONFIRMATION })
export const hideUnlinkConfirmation = () => ({ type: HIDE_UNLINK_CONFIRMATION })

// action creators async
export const unlink = (client, clientInfo) => {
  resetClient(client, clientInfo)

  return { type: UNLINK }
}
