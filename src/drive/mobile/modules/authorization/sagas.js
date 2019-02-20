import {
  restoreCozyClientJs,
  updateBarAccessToken
} from 'drive/mobile/lib/cozy-helper'
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
  const url = client.options.uri
  const { infos, token } = await client.renewAuthorization(url)
  await restoreCozyClientJs(url, infos, token)
  updateBarAccessToken(token)
  dispatch(setUrl(url))
  dispatch(saveCredentials(infos, token))
}
/*
export const setOauthClient = (client) => dispatch => {
  oauthClient.setOAuthOptions(realOauthOptions)
    oauthClient.setCredentials(token)
    await restoreCozyClientJs(client.options.uri, realOauthOptions, token)
    oauthClient.onTokenRefresh = token => {
      updateBarAccessToken(token.accessToken)
      restoreCozyClientJs(client.options.uri, realOauthOptions, token)
      store.dispatch(setToken(token))
    }
    await oauthClient.fetchInformation()
}

const clientInfos = getClientSettings(store.getState())
    console.log('clientInfo index.js', clientInfos)
    
    realOauthOptions =
      clientInfos !== null ? { ...clientInfos, ...getOauthOptions() } : null
    const token = getToken(store.getState())
    const stackClient = client.getStackClient()
    stackClient.setOAuthOptions(realOauthOptions)
    stackClient.setCredentials(token)
    await restoreCozyClientJs(client.options.uri, realOauthOptions, token)
    stackClient.onTokenRefresh = token => {
      updateBarAccessToken(token.accessToken)
      restoreCozyClientJs(client.options.uri, realOauthOptions, token)
      store.dispatch(setToken(token))
    }*/
