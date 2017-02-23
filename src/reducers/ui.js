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
  INDEX_FILES_BY_DATE_SUCCESS,
  SELECT_PHOTO,
  UNSELECT_PHOTO,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR
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

const showSelectionBar = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECTION_BAR:
      return true
    case HIDE_SELECTION_BAR:
      return false
    default:
      return state
  }
}

const selected = (state = [], action) => {
  switch (action.type) {
    case SELECT_PHOTO:
      return [
        ...state,
        action.id
      ]
    case UNSELECT_PHOTO:
      let idx = state.indexOf(action.id)
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    // case OPEN_FOLDER:
    // case DOWNLOAD_SELECTION:
    case HIDE_SELECTION_BAR:
      return []
    default:
      return state
  }
}

export default combineReducers({
  isFetching,
  isIndexing,
  isWorking,
  selected,
  showSelectionBar
})
