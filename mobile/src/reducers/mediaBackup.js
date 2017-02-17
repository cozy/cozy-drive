import { INIT_STATE } from '../actions'
import {
  MEDIA_UPLOAD_START, MEDIA_UPLOAD_END,
  IMAGE_UPLOAD_SUCCESS
} from '../actions/mediaBackup'

const initialState = {
  uploading: false,
  uploaded: []
}

export const mediaBackup = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_UPLOAD_START:
      return { ...state, uploading: true }
    case MEDIA_UPLOAD_END:
      return { ...state, uploading: false }
    case IMAGE_UPLOAD_SUCCESS:
      return { ...state, uploaded: [...state.uploaded, action.id] }
    case INIT_STATE:
      return initialState
    default:
      return state
  }
}
