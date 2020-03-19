import { combineReducers } from 'redux'
import { getFileById } from 'drive/web/modules/navigation/duck'
import get from 'lodash/get'

const getFileByIdFromCozyClient = (state, id) =>
  get(state, ['cozy', 'documents', 'io.cozy.files', id])

// constants
const SELECT_ITEM = 'SELECT_ITEM'
const UNSELECT_ITEM = 'UNSELECT_ITEM'
const TOGGLE_SELECTION_BAR = 'TOGGLE_SELECTION_BAR'
const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'

// selectors
export const isSelected = (state, id) =>
  state.selection.selected.find(_id => _id === id) !== undefined
export const getSelectedIds = state => state.selection.selected
export const isSelectionBarVisible = state =>
  state.selection.selected.length !== 0 || state.selection.isSelectionBarOpened
export const getSelectedFiles = state =>
  getSelectedIds(state).map(
    id => getFileById(state, id) || getFileByIdFromCozyClient(state, id)
  )

// actions
export const showSelectionBar = () => ({ type: SHOW_SELECTION_BAR })
export const hideSelectionBar = () => ({ type: HIDE_SELECTION_BAR })
export const toggleSelectionBar = () => ({ type: TOGGLE_SELECTION_BAR })
export const toggleItemSelection = (id, selected) => ({
  type: selected ? UNSELECT_ITEM : SELECT_ITEM,
  id
})

// reducers
const selected = (state = [], action) => {
  if (action.meta && action.meta.cancelSelection) {
    return []
  }
  switch (action.type) {
    case SELECT_ITEM:
      return [...state, action.id]
    case UNSELECT_ITEM: {
      const idx = state.indexOf(action.id)
      return [...state.slice(0, idx), ...state.slice(idx + 1)]
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
