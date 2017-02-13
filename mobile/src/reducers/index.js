import {combineReducers} from 'redux'

import { reducers } from '../../../src/reducers'
import { mobile } from './mobile'
import { mediaBackup } from './media_backup'

export default combineReducers({
  ...reducers,
  mediaBackup,
  mobile
})
