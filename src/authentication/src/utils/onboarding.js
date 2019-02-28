import localforage from 'localforage'

const ONBOARDING_SECRET_KEY = 'onboarding_secret'
const ONBOARDING_STATE = 'onboarding_state'

const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .substr(2, 11)
}
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
  return generateRandomString()
}
const generateSecret = () => {
  return generateRandomString()
}
export const checkIfOnboardingLogin = onboardingInformations => {
  return onboardingInformations.code !== null
}

export const checkExchangedInformations = (
  localSecret,
  remoteSecret,
  localState,
  remoteState
) => {
  return localSecret === remoteSecret && localState === remoteState
}
export const generateOAuthForUrl = async ({
  clientName,
  redirectURI,
  softwareID,
  softwareVersion,
  clientURI,
  logoURI,
  policyURI,
  scope
}) => {
  let secret = await readSecret()
  if (!secret) {
    secret = generateSecret()
    await writeSecret(secret)
  }
  let state = await readState()

  if (!state) {
    state = generateState()
    await writeState(state)
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
      secret: secret,
      state: state
    }
  }

  return encodeURIComponent(JSON.stringify(oauthStuff))
}

const addProtocolToURL = cozy_url => {
  return `https://${cozy_url}`
}
export const secretExchange = (secret, cozy_url, client) => {
  const response = client.stackClient.fetchJSON(
    'POST',
    addProtocolToURL(cozy_url) + '/auth/secret_exchange',
    {
      secret
    }
  )
  return response
}

export const getAccessToken = (
  { client_id, client_secret },
  cozy_url,
  code,
  client
) => {
  const body = `grant_type=authorization_code&code=${code}&client_id=${client_id}&client_secret=${client_secret}`
  return client.stackClient.fetch(
    'POST',
    addProtocolToURL(cozy_url) + '/auth/access_token',
    body,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
}
