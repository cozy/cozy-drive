import {
  OPEN_FOLDER_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  DELETE_FILE,
  ADD_FOLDER,
  RENAME_FOLDER,
  CREATE_FOLDER_SUCCESS
} from '../actions'

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
    case ADD_FOLDER:
      return [
        action.folder,
        ...state
      ]
    case DELETE_FILE:
      return state.filter(f => f.id !== action.id)
    case RENAME_FOLDER:
      return state.map(f => {
        f.name = (f.id === action.id) ? action.name : f.name
        return f
      })
    case CREATE_FOLDER_SUCCESS:
      return state.map(f => f.id === action.tempId ? action.folder : f)
    default:
      return state
  }
}
