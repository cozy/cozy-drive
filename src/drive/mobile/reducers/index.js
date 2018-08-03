import { combineReducers } from 'redux'

import { settings } from './settings'
import { default as mediaBackup } from '../ducks/mediaBackup'
import { ui } from './ui'
import { authorization } from './authorization'

export default combineReducers({
  authorization,
  settings,
  mediaBackup,
  ui
})
