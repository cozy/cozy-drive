import {combineReducers} from 'redux'

import filesApp from '../../../src/reducers'
import { mobile } from './mobile'

export default combineReducers({
  ...filesApp,
  mobile
})
