import {
  MEDIA_UPLOAD_START, MEDIA_UPLOAD_END
} from '../actions/media_backup'

export const defaultState = {
  uploading: false
}

export const mediaBackup = (state = defaultState, action) => {
  switch (action.type) {
    case MEDIA_UPLOAD_START:
      return { ...state, uploading: true }
    case MEDIA_UPLOAD_END:
      return { ...state, uploading: false }
  }
  return state
}
