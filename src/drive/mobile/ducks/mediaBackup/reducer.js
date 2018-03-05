// We're forced to separate the reducer and selectors from the actions
// to avoid a circular dependency: actions (index.js) import setBackupImages()
// that imports.... that imports configureStore which itself needs to import this reducer

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
export const MEDIA_UPLOAD_ABORT = 'MEDIA_UPLOAD_ABORT'
export const MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS'
export const MEDIA_UPLOAD_CANCEL = 'MEDIA_UPLOAD_CANCEL'
export const MEDIA_UPLOAD_QUOTA = 'MEDIA_UPLOAD_QUOTA'
export const CURRENT_UPLOAD = 'CURRENT_UPLOAD'

const initialState = {
  running: false,
  uploading: false,
  cancelMediaBackup: false,
  abortedMediaBackup: false,
  diskQuotaReached: false,
  uploaded: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_UPLOAD_START:
      return {
        ...state,
        running: true,
        cancelMediaBackup: false,
        abortedMediaBackup: false,
        diskQuotaReached: false
      }
    case MEDIA_UPLOAD_CANCEL:
      return { ...state, cancelMediaBackup: true }
    case MEDIA_UPLOAD_ABORT:
      return { ...state, abortedMediaBackup: true }
    case MEDIA_UPLOAD_QUOTA:
      return { ...state, diskQuotaReached: true }
    case MEDIA_UPLOAD_END:
      return {
        ...state,
        running: false,
        uploading: false,
        cancelMediaBackup: true,
        currentUpload: undefined
      }
    case MEDIA_UPLOAD_SUCCESS:
      return {
        ...state,
        uploaded: [...state.uploaded, action.id]
      }
    case CURRENT_UPLOAD:
      return {
        ...state,
        uploading: true,
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
export default reducer

export const isPreparingBackup = state =>
  state.mobile.mediaBackup.running && !state.mobile.mediaBackup.uploading

export const isUploading = state => state.mobile.mediaBackup.uploading

export const isAborted = state => state.mobile.mediaBackup.abortedMediaBackup

export const isQuotaReached = state => state.mobile.mediaBackup.diskQuotaReached

export const getUploadStatus = state =>
  state.mobile.mediaBackup.currentUpload &&
  !state.mobile.mediaBackup.diskQuotaReached
    ? {
        current: state.mobile.mediaBackup.currentUpload.messageData.current,
        total: state.mobile.mediaBackup.currentUpload.messageData.total
      }
    : {}
