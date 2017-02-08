import { combineReducers } from 'redux'

import { folder, files } from './folder'
import ui from './ui'

import { TRASH_DIR_ID } from '../constants/config.js'

const filesApp = combineReducers({
  folder,
  files,
  ui
})

const sortFiles = files => files.sort((a, b) => a.name.localeCompare(b.name))

const getSortedFiles = allFiles => {
  let folders = allFiles.filter(f => f.type === 'directory' && f.id !== TRASH_DIR_ID && f.dir_id !== TRASH_DIR_ID)
  let files = allFiles.filter(f => f.type !== 'directory' && f.dir_id !== TRASH_DIR_ID)
  return sortFiles(folders).concat(sortFiles(files))
}

export const getVisibleFiles = state => {
  const { files, ui } = state
  return getSortedFiles(files).map(f => {
    let additionalProps = {
      isUpdating: ui.updating.indexOf(f.id) !== -1,
      isOpening: ui.opening === f.id,
      selected: ui.selected.indexOf(f.id) !== -1
    }
    return Object.assign({}, f, additionalProps)
  })
}

export const getFileById = (files, id) => files.find(f => f.id === id)

export const getActionableFile = ({ files, ui }) => getFileById(files, ui.actionable)

export const mustShowSelectionBar = state => state.ui.showSelectionBar || state.ui.selected.length !== 0

export default filesApp
