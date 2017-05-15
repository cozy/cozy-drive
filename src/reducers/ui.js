import { combineReducers } from 'redux'

import {
  SELECT_PHOTO,
  UNSELECT_PHOTO,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR
} from '../constants/actionTypes.js'

export const showSelectionBar = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECTION_BAR:
      return true
    case 'ADD_TO_ALBUM_SUCCESS':
    case HIDE_SELECTION_BAR:
      return false
    default:
      return state
  }
}

export const selected = (state = [], action) => {
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
    case 'ADD_TO_ALBUM_SUCCESS': // when added to album
    case HIDE_SELECTION_BAR:
      return []
    default:
      return state
  }
}

export const showAddToAlbumModal = (state = false, action) => {
  switch (action.type) {
    case 'ADD_TO_ALBUM':
      return !action.album
    case 'CANCEL_ADD_TO_ALBUM':
    case 'ADD_TO_ALBUM_SUCCESS':
      return false
    default:
      return state
  }
}

export default combineReducers({
  selected,
  showSelectionBar,
  showAddToAlbumModal
})
