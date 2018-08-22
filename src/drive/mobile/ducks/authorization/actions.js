import {
  restoreCozyClientJs,
  updateBarAccessToken,
  resetClient
} from '../../lib/cozy-helper'
import { resetPersistedState } from '../../../store/persistedState'
import { setUrl, setOffline } from '../settings'
import { startReplication } from '../replication/duck'

export const SET_TOKEN = 'SET_TOKEN'
export const SET_CLIENT = 'SET_CLIENT'
export const REVOKE = 'REVOKE'
export const UNREVOKE = 'UNREVOKE'
export const UNLINK = 'UNLINK'

const setClient = client => ({ type: SET_CLIENT, client })
export const setToken = token => ({ type: SET_TOKEN, token })

export const revokeClient = () => ({ type: REVOKE })
export const unrevokeClient = () => ({ type: UNREVOKE })

export const saveCredentials = (client, token) => (dispatch, getState) => {
  dispatch(setClient(client))
  dispatch(setToken(token))
  dispatch(setOffline(true))
  // TODO: not ideal to startReplication here, we should be explicit when we start it
  // but we need to restart it when renewing authorization (see below)
  dispatch(startReplication())
}

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
