import { combineReducers } from 'redux'

import {
  RECEIVE_PHOTOS
} from '../constants/actionTypes'

export const isFirstFetch = (state = true, action) => {
  switch (action.type) {
    case RECEIVE_PHOTOS:
      return false
    default:
      return state
  }
}

export default combineReducers({
  isFirstFetch
})
