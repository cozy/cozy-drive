import {
  OPEN_FOLDER_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  TRASH_FILE_SUCCESS,
  RESTORE_FILE_SUCCESS,
  DELETE_FILE,
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
    case CREATE_FOLDER_SUCCESS:
      return [
        ...state,
        action.folder
      ]
    case TRASH_FILE_SUCCESS:
    case RESTORE_FILE_SUCCESS:
    case DELETE_FILE:
      return state.filter(f => f.id !== action.id)
    case RENAME_FOLDER:
      return state.map(f => {
        f.name = (f.id === action.id) ? action.name : f.name
        return f
      })
    default:
      return state
  }
}
