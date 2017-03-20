import { combineReducers } from 'redux'

import albums from './albums'
import { photos } from './photos'
import timeline from './timeline'
import mango from './mango'
import ui from './ui'

const photosApp = combineReducers({
  albums,
  photos,
  timeline,
  ui,
  mango
})

export const mustShowSelectionBar = state => state.ui.showSelectionBar || state.ui.selected.length !== 0

export default photosApp
