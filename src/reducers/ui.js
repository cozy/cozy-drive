import { combineReducers } from 'redux'

import {
  OPEN_FOLDER,
  OPEN_FOLDER_SUCCESS,
  OPEN_FOLDER_FAILURE,
  ADD_FOLDER,
  ABORT_ADD_FOLDER,
  CREATE_FOLDER_SUCCESS,
  TRASH_FILE_SUCCESS,
  RESTORE_FILE_SUCCESS,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR,
  SHOW_DELETE_CONFIRMATION,
  HIDE_DELETE_CONFIRMATION,
  SELECT_FILE,
  UNSELECT_FILE,
  DOWNLOAD_SELECTION,
  SHOW_FILE_ACTIONMENU,
  HIDE_FILE_ACTIONMENU,
  ALERT_CLOSED
} from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case OPEN_FOLDER:
      return true
    case OPEN_FOLDER_SUCCESS:
    case OPEN_FOLDER_FAILURE:
      return false
    default:
      return state
  }
}

const showAddFolder = (state = false, action) => {
  switch (action.type) {
    case ADD_FOLDER:
      return true
    case ABORT_ADD_FOLDER:
    case OPEN_FOLDER:
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
    case TRASH_FILE_SUCCESS:
    case RESTORE_FILE_SUCCESS:
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
      return action.id || null
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

const DEFAULT_ALERT_LEVEL = 'info'

const alert = (state = null, action) => {
  if (action.alert) {
    return {
      message: action.alert.message,
      messageData: action.alert.messageData,
      type: action.alert.type || DEFAULT_ALERT_LEVEL
    }
  } else if (action.type === ALERT_CLOSED) return null
  else return state
}

export default combineReducers({
  isFetching,
  showAddFolder,
  showSelectionBar,
  showDeleteConfirmation,
  selected,
  showFileActionMenu,
  actionable,
  error,
  actionMenu,
  alert
})
