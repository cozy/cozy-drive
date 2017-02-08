import { OPEN_FOLDER_SUCCESS, UPLOAD_FILE_SUCCESS, TRASH_FILE_SUCCESS, ADD_FOLDER, CREATE_FOLDER_SUCCESS } from '../actions'

// reducer for the currently displayed folder properties
export const folder = (state = {}, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      return action.folder
    default:
      return state
  }
}

// reducer for the full file list of the currently displayed folder
export const files = (state = [], action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      return action.files
    case UPLOAD_FILE_SUCCESS:
      return [
        ...state,
        action.file
      ]
    case TRASH_FILE_SUCCESS:
      return state.map(file => file.id === action.file.id ? action.file : file)
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
