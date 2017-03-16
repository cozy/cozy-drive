import {combineReducers} from 'redux'

import { reducers } from '../../../src/reducers'

import { settings } from './settings'
import { mediaBackup } from './mediaBackup'
import { ui } from './ui'
import { authorization } from './authorization'
import { network } from './network'

const mobile = combineReducers({
  network,
  authorization,
  settings,
  mediaBackup,
  ui
})

export default combineReducers({
  ...reducers,
  mobile
})
