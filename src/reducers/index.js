import { combineReducers } from 'redux'

import { folder, files } from './folder'
import ui from './ui'

import { ROOT_DIR_ID, TRASH_DIR_ID, TRASH_DIR_PATH } from '../constants/config.js'

export const reducers = {
  folder,
  files,
  ui
}

const filesApp = combineReducers(reducers)

const sortFiles = files => files.sort((a, b) => a.name.localeCompare(b.name))

const newFilesFirst = files => files.sort((a, b) => {
  if (a.isNew && !b.isNew) return -1
  else if (!a.isNew && b.isNew) return 1
  else return 0
})

const getSortedFiles = allFiles => {
  let folders = allFiles.filter(f => f.type === 'directory' && f.id !== TRASH_DIR_ID)
  let files = allFiles.filter(f => f.type !== 'directory')
  return newFilesFirst(sortFiles(folders)).concat(sortFiles(files))
}

export const getVisibleFiles = state => {
  const { files, ui } = state
  return getSortedFiles(files).map(f => {
    let additionalProps = {
      isUpdating: ui.updating.indexOf(f.id) !== -1,
      isCreating: ui.creating === f.id,
      creationError: (ui.failedCreation && ui.failedCreation.id === f.id) ? ui.failedCreation : null,
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

export const isBrowsingTrash = state => state.folder && state.folder.path && state.folder.path.indexOf(TRASH_DIR_PATH) === 0

export default filesApp
