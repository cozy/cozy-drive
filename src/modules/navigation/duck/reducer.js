import { combineReducers } from 'redux'

import { SORT_FOLDER } from './actions'

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

export default combineReducers({
  sort
})

/**
 * Retrieves the sort value from the view object.
 *
 * @param {Object} state - The state object containing the view property.
 * @returns {string} The sort value.
 */
export const getSort = ({ view }) => view.sort
