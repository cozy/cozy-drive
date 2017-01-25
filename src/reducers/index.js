import { combineReducers } from 'redux'

import { photos } from './photos'
import { mangoIndexByDate } from './mango'
import ui from './ui'

const photosApp = combineReducers({
  photos,
  ui,
  mangoIndexByDate
})

export default photosApp
