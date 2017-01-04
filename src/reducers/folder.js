import { RECEIVE_FILES, UPLOAD_FILE_SUCCESS } from '../actions'

export const folder = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_FILES:
      return action.folder
    default:
      return state
  }
}

export const files = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_FILES:
      return action.files
    case UPLOAD_FILE_SUCCESS:
      return [
        ...state,
        action.file
      ]
    default:
      return state
  }
}
