import { combineReducers } from 'redux'

import folder from './folder'
import ui from './ui'

const filesApp = combineReducers({
  folder,
  ui
})

export default filesApp
