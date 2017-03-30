import {combineReducers} from 'redux'

import { reducers } from '../../../src/reducers'

import { settings } from './settings'
import { mediaBackup } from './mediaBackup'
import { ui } from './ui'
import { authorization } from './authorization'
import { timestamp } from './timestamp'

const mobile = combineReducers({
  authorization,
  settings,
  mediaBackup,
  ui,
  timestamp
})

export default combineReducers({
  ...reducers,
  mobile
})
