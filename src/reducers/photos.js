import {
  RECEIVE_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  UPLOAD_PHOTOS_FAILURE
} from '../actions'

// reducer for the full photos list
export const photos = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PHOTOS:
      return action.photos
    case UPLOAD_PHOTOS_SUCCESS:
    case UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS:
    case UPLOAD_PHOTOS_FAILURE:
      return [
        ...state,
        ...action.photos
      ]
    default:
      return state
  }
}
