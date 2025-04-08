import { combineReducers } from 'redux'

import { SORT_FOLDER, OPERATION_REDIRECTED } from './actions'

// Action type for resetting the flag
export const RESET_OPERATION_REDIRECTED =
  'navigation/RESET_OPERATION_REDIRECTED'

const sort = (state = null, action) => {
  switch (action.type) {
    case SORT_FOLDER:
      return {
        attribute: action.sortAttribute,
        order: action.sortOrder
      }
    default:
      return state
  }
}

// Reducer for the redirection flag
const operationRedirectedReducer = (state = false, action) => {
  switch (action.type) {
    case OPERATION_REDIRECTED:
      return true
    case RESET_OPERATION_REDIRECTED:
      return false
    default:
      return state
  }
}

export default combineReducers({
  sort,
  operationRedirected: operationRedirectedReducer // Add the reducer
})

/**
 * Retrieves the sort value from the view object.
 *
 * @param {Object} state - The state object containing the view property.
 * @returns {string} The sort value.
 */
// Selector needs to point to the correct state slice (`view`)
export const getSort = state => state.view.sort

// Selector for the state (`view`)
export const wasOperationRedirected = state => state.view.operationRedirected
