import flag from 'cozy-flags'
import { setOffline } from 'drive/mobile/modules/settings/duck'
import { startReplication } from 'drive/mobile/modules/replication/sagas'
import { setClient, setToken } from './duck'

export const saveCredentials = (client, token) => dispatch => {
  dispatch(setClient(client))
  dispatch(setToken(token))
  dispatch(setOffline(true))
  // TODO: not ideal to startReplication here, we should be explicit when we start it
  // but we need to restart it when renewing authorization (see below)
  if (!flag('drive.client-migration.enabled')) dispatch(startReplication())
}
