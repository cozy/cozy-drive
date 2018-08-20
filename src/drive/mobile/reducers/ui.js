import {
  SHOW_UNLINK_CONFIRMATION,
  HIDE_UNLINK_CONFIRMATION
} from '../actions/unlink'

export const initialState = {
  displayUnlinkConfirmation: false
}

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_UNLINK_CONFIRMATION:
      return { ...state, displayUnlinkConfirmation: true }
    case HIDE_UNLINK_CONFIRMATION:
      return { ...state, displayUnlinkConfirmation: false }
    default:
      return state
  }
}

export default ui
