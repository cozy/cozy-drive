import { combineReducers } from 'redux'

import {
  CREATE_ALBUM_SUCCESS,
  FETCH_ALBUMS_SUCCESS,
  FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS
} from '../constants/actionTypes'

// reducer for the full album list
export const albumsList = (state = [], action) => {
  switch (action.type) {
    case CREATE_ALBUM_SUCCESS:
      return state.concat([action.album])
    case FETCH_ALBUMS_SUCCESS:
      return action.albums
    default:
      return state
  }
}

// reducer for the current album for the album photos view
export const currentAlbum = (state = {}, action) => {
  switch (action.type) {
    case FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS:
      return action.album
    default:
      return state
  }
}

export default combineReducers({
  albumsList,
  currentAlbum
})
