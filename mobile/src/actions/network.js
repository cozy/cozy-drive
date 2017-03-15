export const CONNECTION = 'CONNECTION'

export const setConnectionState = value => ({ type: CONNECTION, value })

export const onConnectionChange = (dispatch, getConnectionType) => () => {
  dispatch(setConnectionState(getConnectionType()))
}
