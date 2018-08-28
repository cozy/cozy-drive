import { getFileById } from './reducer'
import { getSelectedIds } from 'drive/web/modules/selection/duck'
import { getActionableId } from 'drive/web/modules/actionmenu/duck'

export {
  default,
  isNavigating,
  getVisibleFiles,
  getFileById,
  getOpenedFolderId,
  getFolderIdFromRoute,
  getFolderPath,
  getFolderUrl,
  getSort
} from './reducer'

// TODO: Move the below selectors to their ducks?
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

export {
  openFiles,
  openRecent,
  openTrash,
  openFolder,
  sortFolder,
  fetchMoreFiles,
  fetchRecentFiles,
  addFile,
  updateFile,
  deleteFile,
  getFileDownloadUrl,
  uploadFiles,
  createFolder,
  trashFiles,
  downloadFiles,
  exportFilesNative,
  toggleAvailableOffline,
  openLocalFile,
  openFileWith
} from './actions'
