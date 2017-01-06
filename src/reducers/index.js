import { combineReducers } from 'redux'

import { folder, files } from './folder'
import ui from './ui'

const filesApp = combineReducers({
  folder,
  files,
  ui
})

const sortFiles = files => files.sort((a, b) => a.name.localeCompare(b.name))

const getSortedFiles = allFiles => {
  let folders = allFiles.filter(f => f.type === 'directory')
  let files = allFiles.filter(f => f.type !== 'directory')
  return sortFiles(folders).concat(sortFiles(files))
}

export const getVisibleFiles = state => {
  const { files, ui } = state
  return getSortedFiles(files).map(f => {
    return ui.updating.indexOf(f.id) !== -1
      ? Object.assign({}, f, { isUpdating: true })
      : f
  })
}

export default filesApp
