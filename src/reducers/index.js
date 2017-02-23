import { combineReducers } from 'redux'

import { photos } from './photos'
import { mangoIndexByDate } from './mango'
import ui from './ui'

const photosApp = combineReducers({
  photos,
  ui,
  mangoIndexByDate
})

export const mustShowSelectionBar = state => state.ui.showSelectionBar || state.ui.selected.length !== 0

export const getPhotosByMonth = ({ photos }) => {
  let months = {}
  photos.map(p => {
    // here we want to get an object whose keys are months in a l10able format
    // so we only keep the year and month part of the date
    const month = p.created_at.slice(0, 7) + '-01T00:00'
    /* istanbul ignore else */
    if (!months.hasOwnProperty(month)) {
      months[month] = []
    }
    months[month].push(p)
  })
  return months
}

export default photosApp
