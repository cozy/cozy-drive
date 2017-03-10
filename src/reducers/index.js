import { combineReducers } from 'redux'

import view from './view'
import ui from './ui'

import alerterReducer from 'cozy-ui/react/Alerter'

export const reducers = {
  view,
  ui,
  alerts: alerterReducer
}

const filesApp = combineReducers(reducers)
export default filesApp

// Selectors
import { getFileById } from './view'
export { getVisibleFiles, getFileById, getFolderIdFromRoute, getFolderPath, getFolderUrl } from './view'

export const getSelectedFiles = state => {
  const { ui } = state
  return ui.selected.map(id => getFileById(state, id))
}

export const getActionableFiles = state => {
  const { ui } = state
  if (ui.selected.length > 0) {
    return getSelectedFiles(state)
  } else {
    return [getFileById(state, ui.actionable)]
  }
}
