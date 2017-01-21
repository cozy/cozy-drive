import { combineReducers } from 'redux'

import {
  FETCH_PHOTOS,
  RECEIVE_PHOTOS,
  FETCH_PHOTOS_FAILURE,
  UPLOAD_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_FAILURE,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  DO_INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS
} from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_PHOTOS:
      return action.mangoIndexByDate
    case FETCH_PHOTOS_FAILURE:
    case RECEIVE_PHOTOS:
      return false
    default:
      return state
  }
}

const isIndexing = (state = false, action) => {
  switch (action.type) {
    case DO_INDEX_FILES_BY_DATE:
      return true
    case INDEX_FILES_BY_DATE_SUCCESS:
      return false
    default:
      return state
  }
}

const isWorking = (state = false, action) => {
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
