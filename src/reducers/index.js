import { combineReducers } from 'redux'

import { folder, files, context } from './folder'
import ui from './ui'

import alerterReducer from 'cozy-ui/react/Alerter'

import { ROOT_DIR_ID, TRASH_DIR_ID, APPS_DIR_PATH } from '../constants/config.js'

export const reducers = {
  folder,
  files,
  context,
  ui,
  alerts: alerterReducer
}

const filesApp = combineReducers(reducers)

const sortFiles = files => files.sort((a, b) => a.name.localeCompare(b.name))

const getSortedFiles = allFiles => {
  let folders = allFiles.filter(f => f.type === 'directory' && f.id !== TRASH_DIR_ID && f.path !== APPS_DIR_PATH)
  let files = allFiles.filter(f => f.type !== 'directory')
  return sortFiles(folders).concat(sortFiles(files))
}

export const getVisibleFiles = state => {
  const { files, ui } = state
  return getSortedFiles(files).map(f => {
    let additionalProps = {
      selected: ui.selected.indexOf(f.id) !== -1
    }
    return Object.assign({}, f, additionalProps)
  })
}

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

export default filesApp
