import { setOffline } from 'drive/mobile/modules/settings/duck'
import { setClient, setToken } from './duck'

export const saveCredentials = (client, token) => dispatch => {
  dispatch(setClient(client))
  dispatch(setToken(token))
  dispatch(setOffline(true))
}
