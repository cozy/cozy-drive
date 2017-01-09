import { RECEIVE_FILES, UPLOAD_FILE_SUCCESS, ADD_FOLDER, CREATE_FOLDER_SUCCESS } from '../actions'

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
    case ADD_FOLDER:
      return [
        action.folder,
        ...state
      ]
    case CREATE_FOLDER_SUCCESS:
      return state.map(f => f.id === action.tempId ? action.folder : f)
    default:
      return state
  }
}
