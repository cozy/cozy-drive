import { combineReducers } from 'redux'

import {
  OPEN_FOLDER,
  SELECT_FILE,
  UNSELECT_FILE,
  UNSELECT_ALL,
  SHOW_FILE_ACTIONMENU,
  HIDE_FILE_ACTIONMENU
} from '../actions'

const selected = (state = [], action) => {
  switch (action.type) {
    case SELECT_FILE:
      return [
        ...state,
        action.id
      ]
    case UNSELECT_FILE:
      const idx = state.indexOf(action.id)
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    case OPEN_FOLDER:
    case UNSELECT_ALL:
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

export default combineReducers({
  selected,
  showFileActionMenu,
  actionable,
  actionMenu
})
