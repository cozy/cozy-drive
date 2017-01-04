import { combineReducers } from 'redux'

import { folder, files } from './folder'
import ui from './ui'

const filesApp = combineReducers({
  folder,
  files,
  ui
})

export default filesApp
