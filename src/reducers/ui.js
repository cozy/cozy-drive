import { FETCH_FILES, RECEIVE_FILES, ADD_FOLDER } from '../actions'

const initialState = {
  loading: false,
  renaming: false
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILES:
      return Object.assign({}, state, {
        loading: true
      })
    case RECEIVE_FILES:
      return Object.assign({}, state, {
        loading: false
      })
    case ADD_FOLDER:
      return Object.assign({}, state, {
        renaming: 0
      })
    default:
      return state
  }
}

export default ui
