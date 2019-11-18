import { restoreCozyClientJs } from 'drive/mobile/lib/cozy-helper'
import { setUrl, setOffline } from 'drive/mobile/modules/settings/duck'
import { startReplication } from 'drive/mobile/modules/replication/sagas'
import { setClient, setToken } from './duck'

export const saveCredentials = (client, token) => dispatch => {
  dispatch(setClient(client))
  dispatch(setToken(token))
  dispatch(setOffline(true))
  // TODO: not ideal to startReplication here, we should be explicit when we start it
  // but we need to restart it when renewing authorization (see below)
  dispatch(startReplication())
}

export const renewAuthorization = client => async dispatch => {
  const url = client.getStackClient().uri
  const { infos, token } = await client.renewAuthorization(url)
  restoreCozyClientJs(url, infos, token)
  dispatch(setUrl(url))
  dispatch(saveCredentials(infos, token))
}
