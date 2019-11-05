import { resetClient } from 'drive/mobile/lib/cozy-helper'
import { resetPersistedState } from 'drive/store/persistedState'

export const SET_TOKEN = 'SET_TOKEN'
export const SET_CLIENT = 'SET_CLIENT'
export const REVOKE = 'REVOKE'
export const UNREVOKE = 'UNREVOKE'
export const UNLINK = 'UNLINK'
export const setClient = client => ({ type: SET_CLIENT, client })
export const setToken = token => ({ type: SET_TOKEN, token })

export const revokeClient = () => ({ type: REVOKE })
export const unrevokeClient = () => ({ type: UNREVOKE })

export const unlink = (client, clientInfo) => async dispatch => {
  client.logout()

  resetClient(client, clientInfo)

  await resetPersistedState()
  // This action will be handled by the rootReducer: the store will be restored to its initial state
  return dispatch({ type: UNLINK })
}
