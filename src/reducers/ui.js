import { combineReducers } from 'redux'

import {
  FETCH_FILES,
  RECEIVE_FILES,
  ADD_FOLDER,
  CREATE_FOLDER,
  CREATE_FOLDER_SUCCESS,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS
} from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_FILES:
      return true
    case RECEIVE_FILES:
      return false
    default:
      return state
  }
}

const isAddingFolder = (state = false, action) => {
  switch (action.type) {
    case ADD_FOLDER:
      return true
    case CREATE_FOLDER_SUCCESS:
      return false
    default:
      return state
  }
}

const isWorking = (state = false, action) => {
  switch (action.type) {
    case CREATE_FOLDER:
    case UPLOAD_FILE:
      return true
    case CREATE_FOLDER_SUCCESS:
    case UPLOAD_FILE_SUCCESS:
      return false
    default:
      return state
  }
}

export default combineReducers({
  isFetching,
  isAddingFolder,
  isWorking
})
