import localforage from 'localforage'

const ONBOARDING_SECRET_KEY = 'onboarding_secret'
const ONBOARDING_STATE = 'onboarding_state'

export const writeSecret = secret => {
  return localforage.setItem(ONBOARDING_SECRET_KEY, secret)
}

export const readSecret = () => {
  return localforage.getItem(ONBOARDING_SECRET_KEY)
}

export const clearSecret = () => {
  return localforage.removeItem(ONBOARDING_SECRET_KEY)
}

export const writeState = state => {
  return localforage.setItem(ONBOARDING_STATE, state)
}

export const readState = () => {
  return localforage.getItem(ONBOARDING_STATE)
}

export const clearState = () => {
  return localforage.removeItem(ONBOARDING_STATE)
}
const generateState = () => {
  return 'ezezaeeaz'
}
const generateSecret = () => {
  return 'azertyuiop'
}
export const generateObjectForUrl = async ({
  clientName,
  redirectURI,
  softwareID,
  softwareVersion,
  clientURI,
  logoURI,
  policyURI,
  scope
}) => {
  const storedSecret = await readSecret()
  let secretToUse = storedSecret

  if (!storedSecret) {
    secretToUse = generateSecret()
    await writeSecret(secretToUse)
  }
  const storedState = await readState()
  let stateToUse = storedState
  if (!storedState) {
    stateToUse = generateState()
    await writeState(stateToUse)
  }
  const oauthStuff = {
    redirect_uri: redirectURI,
    software_id: softwareID,
    client_name: clientName,
    software_version: softwareVersion,
    client_kind: 'mobile',
    client_uri: clientURI,
    logo_uri: logoURI,
    policiy_uri: policyURI,
    onboarding: {
      app: softwareID,
      permissions: scope,
      secret: secretToUse,
      state: stateToUse
    }
  }

  return encodeURIComponent(JSON.stringify(oauthStuff))
}

export const secretExchange = (secret, cozy_url, client) => {
  /*
 cozy.client.fetchJSON(
      'POST',
      '/data/io.cozy.files/_all_docs?include_docs=true',
      { keys: ids }
    )
  */
  const url = cozy_url ? `https://${cozy_url}` : 'https://crash5.cozy.works'
  const response = client.stackClient.fetchJSON(
    'POST',
    url + '/auth/secret_exchange',
    {
      secret
    }
  )
  return response
}

export const getAccessToken = (info, cozy_url, code, client) => {
  /*
grant_type, with authorization_code or refresh_token as value
code or refresh_token, depending on which grant type is used
client_id
client_secret

  */
  const url = cozy_url ? `https://${cozy_url}` : 'https://crash5.cozy.works'
  const { /* grant_types, */ client_id, client_secret } = info
  const body = `grant_type=authorization_code&code=${code}&client_id=${client_id}&client_secret=${client_secret}`
  const response = client.stackClient.fetch(
    'POST',
    url + '/auth/access_token',
    body,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  return response
}

//export const onboard = ({ state, code, client }) => {}
