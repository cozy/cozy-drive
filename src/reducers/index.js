import { combineReducers } from 'redux'

import folder from './folder'
import displayedFiles from './displayedFiles'

const filesApp = combineReducers({
  folder,
  displayedFiles
})

export default filesApp
