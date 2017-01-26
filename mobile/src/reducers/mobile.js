import { SETUP, SET_URL } from '../actions'

const initialState = {
  isSetup: false,
  serverUrl: 'https://'
}

export const mobile = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return Object.assign({}, state, { serverUrl: action.url })
    case SETUP:
      return Object.assign({}, state, { isSetup: true })
  }
  return state
}
