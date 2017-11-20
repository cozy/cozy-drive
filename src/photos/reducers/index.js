import { combineReducers } from 'redux'

import ui from './ui'
import selection from '../ducks/selection'
import upload from '../ducks/upload'
import alerterReducer from 'cozy-ui/react/Alerter'
import { reducer } from 'cozy-client'

const photosApp = combineReducers({
  cozy: reducer,
  ui,
  selection,
  upload,
  alerts: alerterReducer
})

export default photosApp
