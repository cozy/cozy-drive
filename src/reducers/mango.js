import { combineReducers } from 'redux'

import {
  INDEX_FILES_BY_DATE_SUCCESS,
  INDEX_ALBUMS_BY_NAME_SUCCESS
} from '../constants/actionTypes'

// indexing using cozy-stack mango
export const filesIndexByDate = (state = null, action) => {
  switch (action.type) {
    case INDEX_FILES_BY_DATE_SUCCESS:
      return action.mangoIndexByDate
    default:
      return state
  }
}

export const albumsIndexByName = (state = null, action) => {
  switch (action.type) {
    case INDEX_ALBUMS_BY_NAME_SUCCESS:
      return action.mangoIndex
    default:
      return state
  }
}

export default combineReducers({
  filesIndexByDate,
  albumsIndexByName
})
