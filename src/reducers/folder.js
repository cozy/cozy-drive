import { RECEIVE_FILES } from '../actions'

const folder = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_FILES:
      return action.folder
    default:
      return state
  }
}

export default folder
