import { combineReducers } from 'redux'

import { reducers } from '../../reducers'

import { settings } from './settings'
import mediaBackup from 'drive/mobile/ducks/mediaBackup'
import { ui } from './ui'
import { authorization } from './authorization'
import { UNLINK } from '../actions/unlink'

const mobile = combineReducers({
  authorization,
  settings,
  mediaBackup,
  ui
})

const appReducer = combineReducers({
  ...reducers,
  mobile
})

const rootReducer = (state, action) => {
  if (action.type === UNLINK) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
