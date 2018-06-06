import view, { getFileById } from './view'
import settings from './settings'

import selectionReducer, { getSelectedIds } from '../ducks/selection'
import actionmenuReducer, { getActionableId } from '../ducks/actionmenu'
import renameReducer from '../ducks/files/rename'
import upload from '../ducks/upload'
import availableOffline from '../ducks/files/availableOffline'
import uiReducer from 'react-cozy-helpers'

export const reducers = {
  ui: uiReducer,
  view,
  settings,
  upload,
  actionmenu: actionmenuReducer,
  selection: selectionReducer,
  rename: renameReducer,
  availableOffline
}

export default reducers

// Selectors
export {
  isNavigating,
  getVisibleFiles,
  getFileById,
  getFolderIdFromRoute,
  getFolderPath,
  getFolderUrl,
  getSort,
  getLoadedFilesCount,
  getLoadedFoldersCount
} from './view'
export { isMenuVisible as isActionMenuVisible } from '../ducks/actionmenu'

export const getSelectedFiles = state => {
  return getSelectedIds(state).map(id => getFileById(state, id))
}

export const getActionableFiles = state => {
  if (getSelectedIds(state).length > 0) {
    return getSelectedFiles(state)
  } else {
    return [getFileById(state, getActionableId(state))]
  }
}
