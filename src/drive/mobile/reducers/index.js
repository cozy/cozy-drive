import { combineReducers } from 'redux'

import { reducers } from '../../reducers'

import { settings } from './settings'
import { default as mediaBackup } from '../ducks/mediaBackup'

import { ui } from './ui'
import { authorization } from './authorization'

const mobile = combineReducers({
  authorization,
  settings,
  mediaBackup,
  ui
})

export default {
  ...reducers,
  mobile
}
