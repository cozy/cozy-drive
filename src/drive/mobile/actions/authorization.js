import {
  restoreCozyClientJs,
  updateBarAccessToken,
  resetClient
} from '../lib/cozy-helper'
import { resetPersistedState } from '../../store/persistedState'
import { setUrl, saveCredentials } from './settings'

export const REVOKE = 'REVOKE'
export const UNREVOKE = 'UNREVOKE'
export const UNLINK = 'UNLINK'

export const revokeClient = () => ({ type: REVOKE })
export const unrevokeClient = () => ({ type: UNREVOKE })

export const renewAuthorization = client => async dispatch => {
  const url = client.options.uri
  const { infos, token } = await client.renewAuthorization(url)
  await restoreCozyClientJs(url, infos, token)
  updateBarAccessToken(token)
  dispatch(setUrl(url))
  dispatch(saveCredentials(infos, token))
}

export const unlink = (client, clientInfo) => async dispatch => {
  resetClient(client, clientInfo)
  await resetPersistedState()
  // This action will be handled by the rootReducer: the store will be restored to its initial state
  return dispatch({ type: UNLINK })
}
