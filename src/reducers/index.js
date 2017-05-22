import { combineReducers } from 'redux'

import ui from './ui'
import lists from '../ducks/lists'
import upload from '../ducks/upload'
import alerterReducer from 'cozy-ui/react/Alerter'

const photosApp = combineReducers({
  ui,
  lists,
  upload,
  alerts: alerterReducer
})

export const mustShowSelectionBar = state => state.ui.showSelectionBar || state.ui.selected.length !== 0

export default photosApp
