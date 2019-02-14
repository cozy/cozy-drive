import { getServerUrl } from 'drive/mobile/modules/settings/duck'

const getProp = (state, key) => {
  if (
    state.mobile &&
    state.mobile.authorization &&
    state.mobile.authorization[key] !== undefined
  ) {
    return state.mobile.authorization[key]
  }
  console.warn(`Authorization prop not found: ${key}`)
  return undefined
}

export const isAuthorized = state => getProp(state, 'authorized')
export const isRevoked = state => getProp(state, 'revoked')
export const getToken = state => getProp(state, 'token')
export const getClientSettings = state => getProp(state, 'client')
export const getOnboardingInformations = state => getProp(state, 'onboarding')
export const isClientRevoked = (error, state) => {
  return (
    getServerUrl(state) &&
    (error.status === 404 ||
      error.status === 401 ||
      error.message.match(/Client has been revoked/))
  )
}
