import { combineReducers } from 'redux'

const SELECT_FILE = 'SELECT_FILE'
const UNSELECT_FILE = 'UNSELECT_FILE'
const TOGGLE_SELECTION_BAR = 'TOGGLE_SELECTION_BAR'
const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'

// reducers
const selected = (state = [], action) => {
  if (action.meta && action.meta.cancelSelection) {
    return []
  }
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
    case HIDE_SELECTION_BAR:
      return []
    default:
      return state
  }
}

const isBarOpened = (state = false, action) => {
  if (action.meta && action.meta.cancelSelection) {
    return false
  }
  switch (action.type) {
    case TOGGLE_SELECTION_BAR:
      return !state
    case SHOW_SELECTION_BAR:
      return true
    case HIDE_SELECTION_BAR:
      return false
    default:
      return state
  }
}

export default combineReducers({
  selected,
  isBarOpened
})

// selectors
export const getSelectedIds = state => state.selection.selected

export const isBarVisible = state =>
  state.selection.selected.length !== 0 || state.selection.isBarOpened

// actions
export const showSelectionBar = () => ({
  type: SHOW_SELECTION_BAR
})

export const hideSelectionBar = () => ({
  type: HIDE_SELECTION_BAR
})

export const toggleSelectionBar = () => ({
  type: TOGGLE_SELECTION_BAR
})

export const toggleFileSelection = (file, selected) => ({
  type: selected ? UNSELECT_FILE : SELECT_FILE,
  id: file.id
})
