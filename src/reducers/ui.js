import { combineReducers } from 'redux'

import {
  FETCH_FILES,
  RECEIVE_FILES,
  CREATE_FOLDER,
  CREATE_FOLDER_SUCCESS,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS
} from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_FILES:
      return action.folderId
    case RECEIVE_FILES:
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

const updating = (state = [], action) => {
  switch (action.type) {
    case CREATE_FOLDER:
      return [
        ...state,
        action.id
      ]
    case CREATE_FOLDER_SUCCESS:
      let idx = state.indexOf(action.tempId)
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    default:
      return state
  }
}

export default combineReducers({
  isFetching,
  isWorking,
  updating
})
