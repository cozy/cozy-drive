import {combineReducers} from 'redux'

import {folder, files} from '../../../src/reducers/folder'
import ui from '../../../src/reducers/ui'
import {mobile} from './mobile'

const filesApp = combineReducers({
  folder,
  files,
  ui,
  mobile
})

export default filesApp
