import { combineReducers } from 'redux'

import view, { getFileById } from './view'
import settings from './settings'

import selectionReducer, { getSelectedIds } from '../ducks/selection'
import actionmenuReducer, { getActionableId } from '../ducks/actionmenu'
import renameReducer from '../ducks/files/rename'
import alerterReducer from 'cozy-ui/react/Alerter'
import saveFolderReducer from '../ducks/saveFolder'

export const reducers = {
  view,
  settings,
  actionmenu: actionmenuReducer,
  selection: selectionReducer,
  rename: renameReducer,
  alerts: alerterReducer,
  saveFolder: saveFolderReducer
}

const filesApp = combineReducers(reducers)
export default filesApp

// Selectors
export { getVisibleFiles, getFileById, getFolderIdFromRoute, getFolderPath, getFolderUrl } from './view'
export { isBarVisible as isSelectionBarVisible } from '../ducks/selection'
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
