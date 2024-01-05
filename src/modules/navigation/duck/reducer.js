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

export const getSort = ({ view }) => view.sort
