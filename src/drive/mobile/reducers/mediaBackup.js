import {
  MEDIA_UPLOAD_START,
  MEDIA_UPLOAD_END,
  MEDIA_UPLOAD_CANCEL,
  MEDIA_UPLOAD_SUCCESS,
  CURRENT_UPLOAD
} from '../actions/mediaBackup'

export const initialState = {
  uploading: false,
  uploaded: []
}

export const mediaBackup = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_UPLOAD_CANCEL:
      return { ...state, cancelMediaBackup: true }
    case MEDIA_UPLOAD_START:
      return { ...state, uploading: true, cancelMediaBackup: false }
    case MEDIA_UPLOAD_END:
      return {
        ...state,
        uploading: false,
        cancelMediaBackup: true,
        currentUpload: undefined
      }
    case MEDIA_UPLOAD_SUCCESS:
      return { ...state, uploaded: [...state.uploaded, action.id] }
    case CURRENT_UPLOAD:
      return {
        ...state,
        currentUpload: {
          media: action.media,
          message: action.message,
          messageData: action.messageData
        }
      }
    default:
      return state
  }
}

export default mediaBackup
