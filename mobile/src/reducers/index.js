import {combineReducers} from 'redux'

import { reducers } from '../../../src/reducers'
import { mobile } from './mobile'

export default combineReducers({
  ...reducers,
  mobile
})
