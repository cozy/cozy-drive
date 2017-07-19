import { combineReducers } from 'redux'

export const isAddToAlbumModalOpened = (state = false, action) => {
  switch (action.type) {
    case 'ADD_TO_ALBUM':
      return !action.album
    case 'CANCEL_ADD_TO_ALBUM':
    case 'ADD_TO_ALBUM_SUCCESS':
    case 'REMOVE_FROM_ALBUM':
      return false
    default:
      return state
  }
}

export default combineReducers({
  isAddToAlbumModalOpened
})
