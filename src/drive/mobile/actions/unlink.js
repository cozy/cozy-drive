import { resetClient } from '../lib/cozy-helper'
import { resetPersistedState } from '../../store/persistedState'

// constants
export const SHOW_UNLINK_CONFIRMATION = 'SHOW_UNLINK_CONFIRMATION'
export const HIDE_UNLINK_CONFIRMATION = 'HIDE_UNLINK_CONFIRMATION'
export const UNLINK = 'UNLINK'

// action creators sync
export const showUnlinkConfirmation = () => ({ type: SHOW_UNLINK_CONFIRMATION })
export const hideUnlinkConfirmation = () => ({ type: HIDE_UNLINK_CONFIRMATION })

// action creators async
export const unlink = (client, clientInfo) => async dispatch => {
  resetClient(client, clientInfo)
  await resetPersistedState()
  // This action will be handled by the rootReducer: the store will be restored to its initial state
  return dispatch({ type: UNLINK })
}
