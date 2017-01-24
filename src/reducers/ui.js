import { combineReducers } from 'redux'

import {
  FETCH_PHOTOS,
  RECEIVE_PHOTOS,
  FETCH_PHOTOS_FAILURE,
  UPLOAD_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_FAILURE,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS
} from '../constants/actionTypes.js'

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_PHOTOS:
      return true
    case FETCH_PHOTOS_FAILURE:
    case RECEIVE_PHOTOS:
      return false
    default:
      return state
  }
}

export const isIndexing = (state = false, action) => {
  switch (action.type) {
    case INDEX_FILES_BY_DATE:
      return true
    case INDEX_FILES_BY_DATE_SUCCESS:
      return false
    default:
      return state
  }
}

export const isWorking = (state = false, action) => {
  switch (action.type) {
    case UPLOAD_PHOTOS:
      return true
    case UPLOAD_PHOTOS_FAILURE:
    case UPLOAD_PHOTOS_SUCCESS:
    case UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS:
      return false
    default:
      return state
  }
}

export default combineReducers({
  isFetching,
  isIndexing,
  isWorking
})
