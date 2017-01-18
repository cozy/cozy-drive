import { SETUP } from '../actions'

const initialState = {
  isSetup: false
}

export const mobile = (state = initialState, action) => {
  switch (action.type) {
    case SETUP:
      return { isSetup: true }
  }
  return state
}
