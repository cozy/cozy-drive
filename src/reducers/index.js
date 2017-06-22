import { combineReducers } from 'redux'

import ui from './ui'
import selection from '../ducks/selection'
import lists from '../ducks/lists'
import upload from '../ducks/upload'
import alerterReducer from 'cozy-ui/react/Alerter'
import apiReducer from '../lib/redux-cozy-api'

const photosApp = combineReducers({
  api: apiReducer,
  ui,
  selection,
  lists,
  upload,
  alerts: alerterReducer
})

export default photosApp
