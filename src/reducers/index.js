import { combineReducers } from 'redux'

import view from './view'
import ui from './ui'

import alerterReducer from 'cozy-ui/react/Alerter'

import { ROOT_DIR_ID } from '../constants/config.js'

export const reducers = {
  view,
  ui,
  alerts: alerterReducer
}

const filesApp = combineReducers(reducers)
export default filesApp

// Selectors
export { getVisibleFiles, getVirtualRootFromUrl, getUrlFromParams } from './view'

export const isRootFolder = folder => folder.id === ROOT_DIR_ID

export const getFilePaths = ({ files, folder }, ids) => {
  return ids.map(id => files.find(f => f.id === id))
    .map(f => f.type === 'directory' ? f.path : (isRootFolder(folder) ? `/${f.name}` : `${folder.path}/${f.name}`))
}

export const getFileById = (files, id) => files.find(f => f.id === id)

export const getActionableFiles = ({ files, ui }) => {
  if (ui.selected.length > 0) {
    return ui.selected.map(id => getFileById(files, id))
  } else {
    return [getFileById(files, ui.actionable)]
  }
}

export const mustShowSelectionBar = state => state.ui.showSelectionBar || state.ui.selected.length !== 0
export const mustShowAddFolder = state => state.ui.showAddFolder
