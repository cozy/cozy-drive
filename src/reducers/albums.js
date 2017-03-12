import {
  CREATE_ALBUM_SUCCESS,
  FETCH_ALBUMS_SUCCESS
} from '../constants/actionTypes'

// reducer for the full album list
export const albums = (state = [], action) => {
  switch (action.type) {
    case CREATE_ALBUM_SUCCESS:
      return state.concat([action.album])
    case FETCH_ALBUMS_SUCCESS:
      return action.albums
    default:
      return state
  }
}
