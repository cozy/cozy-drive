import { getServerUrl } from 'drive/mobile/modules/settings/duck'

const getProp = (state, key) => {
  if (
    state.mobile &&
    state.mobile.authorization &&
    state.mobile.authorization[key] !== undefined
  ) {
    return state.mobile.authorization[key]
  }
  return undefined
}

export const getToken = state => getProp(state, 'token')
export const getClientSettings = state => getProp(state, 'client')
export const isClientRevoked = (error, state) => {
  return (
    getServerUrl(state) &&
    (error.status === 404 ||
      error.status === 401 ||
      error.message.match(/Client has been revoked/))
  )
}
