import { CONNECTION } from '../actions/network'

export const network = (state = {}, action) => {
  switch (action.type) {
    case CONNECTION:
      return { ...state, connection: action.value }
    default:
      return state
  }
}
