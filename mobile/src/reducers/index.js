import {combineReducers} from 'redux'

import { reducers } from '../../../src/reducers'

import { settings } from './settings'
import { mediaBackup } from './mediaBackup'
import { ui } from './ui'

const mobile = combineReducers({
  settings,
  mediaBackup,
  ui
})

export default combineReducers({
  ...reducers,
  mobile
})
