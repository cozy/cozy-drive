import {combineReducers} from 'redux'

import { reducers } from '../../../src/reducers'

import { settings } from './settings'
import { mediaBackup } from './mediaBackup'
import { ui } from './ui'
import { authorization } from './authorization'

const mobile = combineReducers({
  authorization,
  settings,
  mediaBackup,
  ui
})

export default combineReducers({
  ...reducers,
  mobile
})
