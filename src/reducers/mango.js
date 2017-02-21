import { combineReducers } from 'redux'

import { INDEX_FILES_BY_DATE_SUCCESS } from '../constants/actionTypes'

// indexing using cozy-stack mango
export const filesIndexByDate = (state = null, action) => {
  switch (action.type) {
    case INDEX_FILES_BY_DATE_SUCCESS:
      return action.mangoIndexByDate
    default:
      return state
  }
}

export default combineReducers({
  filesIndexByDate
})
