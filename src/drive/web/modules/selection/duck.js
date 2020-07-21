import { combineReducers } from 'redux'
import uniqBy from 'lodash/uniqBy'

// constants
const SELECT_ITEM = 'SELECT_ITEM'
const UNSELECT_ITEM = 'UNSELECT_ITEM'
const TOGGLE_SELECTION_BAR = 'TOGGLE_SELECTION_BAR'
const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'

// selectors
export const isSelected = (state, file) =>
  state.selection.selected.find(({ id }) => id === file.id) !== undefined
export const isSelectionBarVisible = state =>
  state.selection.selected.length !== 0 || state.selection.isSelectionBarOpened
export const getSelectedFiles = state => {
  return state.selection.selected
}

// actions
export const showSelectionBar = () => ({ type: SHOW_SELECTION_BAR })
export const hideSelectionBar = () => ({ type: HIDE_SELECTION_BAR })
export const toggleSelectionBar = () => ({ type: TOGGLE_SELECTION_BAR })
export const toggleItemSelection = (file, selected) => ({
  type: selected ? UNSELECT_ITEM : SELECT_ITEM,
  file
})

// reducers
const selected = (state = [], action) => {
  if (action.meta && action.meta.cancelSelection) {
    return []
  }
  switch (action.type) {
    case SELECT_ITEM:
      return uniqBy([...state, action.file], 'id')
    case UNSELECT_ITEM: {
      return state.filter(({ id }) => action.file.id !== id)
    }
    case HIDE_SELECTION_BAR:
      return []
    default:
      return state
  }
}

const isSelectionBarOpened = (state = false, action) => {
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
  isSelectionBarOpened
})
