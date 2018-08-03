import { restoreCozyClientJs, updateBarAccessToken } from '../lib/cozy-helper'
import { setUrl, saveCredentials } from './settings'

export const REVOKE = 'REVOKE'
export const UNREVOKE = 'UNREVOKE'

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
