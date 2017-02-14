import {
  MEDIA_UPLOAD_START, MEDIA_UPLOAD_END,
  IMAGE_UPLOAD_SUCCESS
} from '../actions/media_backup'

export const defaultState = {
  uploading: false,
  uploaded:[]
}

export const mediaBackup = (state = defaultState, action) => {
  switch (action.type) {
    case MEDIA_UPLOAD_START:
      return { ...state, uploading: true }
    case MEDIA_UPLOAD_END:
      return { ...state, uploading: false }
    case IMAGE_UPLOAD_SUCCESS:
      return { ...state, uploaded: [...state.uploaded, action.id] }
  }
  return state
}
