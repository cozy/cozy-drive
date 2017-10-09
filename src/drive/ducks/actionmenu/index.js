import { combineReducers } from 'redux'

const SHOW_ACTIONMENU = 'SHOW_ACTIONMENU'
const HIDE_ACTIONMENU = 'HIDE_ACTIONMENU'

// reducers
const isVisible = (state = false, action) => {
  if (action.meta && action.meta.hideActionMenu) {
    return false
  }
  switch (action.type) {
    case SHOW_ACTIONMENU:
      return true
    case HIDE_ACTIONMENU:
      return false
    default:
      return state
  }
}

const actionable = (state = null, action) => {
  if (action.meta && action.meta.hideActionMenu) {
    return null
  }
  switch (action.type) {
    case SHOW_ACTIONMENU:
      return action.id || null
    case HIDE_ACTIONMENU:
      return null
    default:
      return state
  }
}

export default combineReducers({
  isVisible,
  actionable
})

// selectors
export const getActionableId = state => state.actionmenu.actionable
export const isMenuVisible = state => state.actionmenu.isVisible

// actions
export const showActionMenu = id => ({
  type: SHOW_ACTIONMENU,
  id
})

export const hideActionMenu = () => ({
  type: HIDE_ACTIONMENU
})
