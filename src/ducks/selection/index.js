import { combineReducers } from 'redux'
import { downloadArchive } from '../../lib/redux-cozy-client'
import SelectionBar from './SelectionBar'

// constants
const SELECT_ITEM = 'SELECT_ITEM'
const UNSELECT_ITEM = 'UNSELECT_ITEM'
const ADD_TO_SELECTION = 'ADD_TO_SELECTION'
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION'
const TOGGLE_SELECTION_BAR = 'TOGGLE_SELECTION_BAR'
const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'

// selectors
export const getSelectedIds = state => state.selection.selected
export const isSelectionBarVisible = state => state.selection.selected.length !== 0 || state.selection.isSelectionBarOpened

// actions
export const showSelectionBar = () => ({ type: SHOW_SELECTION_BAR })
export const hideSelectionBar = () => ({ type: HIDE_SELECTION_BAR })
export const toggleSelectionBar = () => ({ type: TOGGLE_SELECTION_BAR })
export const toggleItemSelection = (item, selected) => ({ type: selected ? UNSELECT_ITEM : SELECT_ITEM, id: item.id })
export const addToSelection = (ids) => ({ type: ADD_TO_SELECTION, ids })
export const removeFromSelection = (ids) => ({ type: REMOVE_FROM_SELECTION, ids })
export const downloadSelection = (selected) => downloadArchive('selection', selected)

// components
export { SelectionBar }

// reducers
const selected = (state = [], action) => {
  if (action.meta && action.meta.cancelSelection) {
    return []
  }
  switch (action.type) {
    case SELECT_ITEM:
      return [
        ...state,
        action.id
      ]
    case UNSELECT_ITEM:
      const idx = state.indexOf(action.id)
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    case ADD_TO_SELECTION:
      const newIds = action.ids.filter(id => state.indexOf(id) === -1)
      return [...state, ...newIds]
    case REMOVE_FROM_SELECTION:
      return state.filter(id => action.ids.indexOf(id) === -1)
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
