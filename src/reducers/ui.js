import { combineReducers } from 'redux'

import {
  FETCH_FILES,
  RECEIVE_FILES,
  OPEN_FOLDER,
  OPEN_FOLDER_SUCCESS,
  OPEN_FOLDER_FAILURE,
  ADD_FOLDER,
  ABORT_ADD_FOLDER,
  CREATE_FOLDER,
  CREATE_FOLDER_SUCCESS,
  CREATE_FOLDER_FAILURE_DUPLICATE,
  CREATE_FOLDER_FAILURE_GENERIC,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS,
  TRASH_FILE,
  TRASH_FILE_SUCCESS,
  TRASH_FILE_FAILURE,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR,
  SHOW_DELETE_CONFIRMATION,
  HIDE_DELETE_CONFIRMATION,
  SELECT_FILE,
  UNSELECT_FILE,
  DOWNLOAD_SELECTION,
  SHOW_FILE_ACTIONMENU,
  HIDE_FILE_ACTIONMENU,
  DISPLAY_TOAST,
  HIDE_TOAST,
  ALERT_CLOSED
} from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_FILES:
      return true
    case RECEIVE_FILES:
      return false
    default:
      return state
  }
}

export const currentFolderId = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER:
      return action.folderId
    default:
      return state
  }
}

const isWorking = (state = false, action) => {
  switch (action.type) {
    case CREATE_FOLDER:
    case UPLOAD_FILE:
    case TRASH_FILE:
      return true
    case CREATE_FOLDER_SUCCESS:
    case CREATE_FOLDER_FAILURE_DUPLICATE:
    case CREATE_FOLDER_FAILURE_GENERIC:
    case UPLOAD_FILE_SUCCESS:
    case TRASH_FILE_SUCCESS:
    case TRASH_FILE_FAILURE:
      return false
    default:
      return state
  }
}

const opening = (state = false, action) => {
  switch (action.type) {
    case OPEN_FOLDER:
      return action.folderId
    case OPEN_FOLDER_SUCCESS:
    case OPEN_FOLDER_FAILURE:
      return false
    default:
      return state
  }
}

const creating = (state = false, action) => {
  switch (action.type) {
    case CREATE_FOLDER:
      return action.id
    case CREATE_FOLDER_SUCCESS:
    case CREATE_FOLDER_FAILURE_DUPLICATE:
    case CREATE_FOLDER_FAILURE_GENERIC:
      return false
    default:
      return state
  }
}

const failedCreation = (state = null, action) => {
  switch (action.type) {
    case CREATE_FOLDER:
      return null
    case CREATE_FOLDER_FAILURE_DUPLICATE:
    case CREATE_FOLDER_FAILURE_GENERIC:
      return {
        id: action.id
      }
    default:
      return state
  }
}

const updating = (state = [], action) => {
  switch (action.type) {
    case CREATE_FOLDER:
      return [
        ...state,
        action.id
      ]
    case CREATE_FOLDER_SUCCESS:
      let idx = state.indexOf(action.tempId)
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    default:
      return state
  }
}

const disableFolderCreation = (state = false, action) => {
  switch (action.type) {
    case ADD_FOLDER:
      return true
    case ABORT_ADD_FOLDER:
    case CREATE_FOLDER_SUCCESS:
      return false
    default:
      return state
  }
}

const showSelectionBar = (state = false, action) => {
  switch (action.type) {
    case SHOW_SELECTION_BAR:
      return true
    case OPEN_FOLDER:
    case DOWNLOAD_SELECTION:
    case HIDE_SELECTION_BAR:
      return false
    default:
      return state
  }
}

const showDeleteConfirmation = (state = false, action) => {
  switch (action.type) {
    case SHOW_DELETE_CONFIRMATION:
      return true
    case HIDE_DELETE_CONFIRMATION:
      return false
    default:
      return state
  }
}

const selected = (state = [], action) => {
  switch (action.type) {
    case SELECT_FILE:
      return [
        ...state,
        action.id
      ]
    case UNSELECT_FILE:
      let idx = state.indexOf(action.id)
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    case OPEN_FOLDER:
    case DOWNLOAD_SELECTION:
    case HIDE_SELECTION_BAR:
      return []
    default:
      return state
  }
}

const showFileActionMenu = (state = false, action) => {
  switch (action.type) {
    case SHOW_FILE_ACTIONMENU:
      return true
    case HIDE_FILE_ACTIONMENU:
      return false
    default:
      return state
  }
}

const actionable = (state = null, action) => {
  switch (action.type) {
    case SHOW_FILE_ACTIONMENU:
      return action.id
    case HIDE_FILE_ACTIONMENU:
      return null
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_FAILURE:
      return {
        message: 'error.open_folder',
        cause: action.error,
        critical: true
      }
    default:
      return state
  }
}

const toastMessage = (state = null, action) => {
  switch (action.type) {
    case DISPLAY_TOAST:
      return {
        message: action.message,
        duration: action.duration || 3000,
        criticity: action.criticity || 'critical'
      }
    case HIDE_TOAST:
      return null
    default:
      return state
  }
}

const actionMenu = (state = { openWith: false }, action) => {
  const newState = {}
  switch (action.type) {
    case 'SHOW_SPINNER':
      newState[action.menu] = true
      return Object.assign({}, state, newState)
    case 'HIDE_SPINNER':
      newState[action.menu] = false
      return Object.assign({}, state, newState)
    default:
      return state
  }
}

const alert = (state = null, action) => {
  switch (action.type) {
    case TRASH_FILE_FAILURE:
      return {
        message: 'alert.trash_file_error',
        type: 'error'
      }
    case TRASH_FILE_SUCCESS:
      return {
        message: 'alert.trash_file_success',
        type: 'info'
      }
    case ABORT_ADD_FOLDER:
      return action.accidental ? {
        message: 'alert.folder_abort',
        type: 'info'
      } : state
    case CREATE_FOLDER_FAILURE_DUPLICATE:
      return {
        message: 'alert.folder_name',
        messageData: {folderName: action.name},
        type: 'error'
      }
    case CREATE_FOLDER_FAILURE_GENERIC:
      return {
        message: 'alert.folder_generic',
        type: 'error'
      }
    case ALERT_CLOSED:
      return null
    default:
      return state
  }
}

export default combineReducers({
  isFetching,
  currentFolderId,
  isWorking,
  opening,
  creating,
  failedCreation,
  updating,
  disableFolderCreation,
  showSelectionBar,
  showDeleteConfirmation,
  selected,
  showFileActionMenu,
  actionable,
  error,
  toastMessage,
  actionMenu,
  alert
})
