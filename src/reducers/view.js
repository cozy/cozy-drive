import { combineReducers } from 'redux'

import {
  LOCATION_CHANGE,
  OPEN_FOLDER_SUCCESS,
  OPEN_FOLDER_FAILURE,
  UPLOAD_FILE_SUCCESS,
  TRASH_FILES_SUCCESS,
  RESTORE_FILES_SUCCESS,
  RENAME_FOLDER,
  CREATE_FOLDER_SUCCESS
} from '../actions'

import { ROOT_DIR_ID, TRASH_DIR_ID, APPS_DIR_PATH, KONNECTORS_DIR_PATH } from '../constants/config.js'

// reducer for the currently displayed folder properties
const displayedFolder = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      return action.folder
    default:
      return state
  }
}

// reducer for the full file list of the currently displayed folder
const files = (state = [], action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      return action.files
    case UPLOAD_FILE_SUCCESS:
      return [
        ...state,
        action.file
      ]
    case CREATE_FOLDER_SUCCESS:
      return [
        ...state,
        action.folder
      ]
    case TRASH_FILES_SUCCESS:
    case RESTORE_FILES_SUCCESS:
      return state.filter(f => action.ids.indexOf(f.id) === -1)
    case RENAME_FOLDER:
      return state.map(f => {
        f.name = (f.id === action.id) ? action.name : f.name
        return f
      })
    default:
      return state
  }
}

const fetchStatus = (state = null, action) => {
  switch (action.type) {
    // there's a trick here : we set the fetchStatus to 'pending' only on
    // the LOCATION_CHANGE action so that the loading spinner is only showed
    // when the app is launched or when the user use the back button
    case LOCATION_CHANGE:
      return 'pending'
    case OPEN_FOLDER_SUCCESS:
      return 'loaded'
    case OPEN_FOLDER_FAILURE:
      return 'failed'
    default:
      return state
  }
}

const lastFetch = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case OPEN_FOLDER_FAILURE:
      return Date.now()
    default:
      return state
  }
}

export default combineReducers({
  displayedFolder,
  files,
  fetchStatus,
  lastFetch
})

const sortFiles = files => files.sort((a, b) => a.name.localeCompare(b.name))

const getSortedFiles = allFiles => {
  let folders = allFiles.filter(f => f.type === 'directory' && f.id !== TRASH_DIR_ID && f.path !== APPS_DIR_PATH && f.path !== KONNECTORS_DIR_PATH)
  let files = allFiles.filter(f => f.type !== 'directory')
  return sortFiles(folders).concat(sortFiles(files))
}

export const getVisibleFiles = ({ view }) => {
  const { files } = view
  return getSortedFiles(files)
}

export const getFileById = ({ view }, id) => {
  let file = view.files.find(f => f.id === id)
  if (!file) return null
  // we need the path for some actions, like selection download
  // but the stack only provides the path for folders...
  return Object.assign({}, file, { path: getFilePath({ view }, file) })
}

const isRootFolder = folder => folder.id === ROOT_DIR_ID

export const getFilePath = ({ view }, file) => {
  const { displayedFolder } = view
  return file.type === 'directory'
    ? file.path
    : (isRootFolder(displayedFolder) ? `/${file.name}` : `${displayedFolder.path}/${file.name}`)
}

export const getFolderIdFromRoute = (location, params) => {
  if (params.folderId) return params.folderId
  if (location.pathname.match(/^\/files/)) return ROOT_DIR_ID
  if (location.pathname.match(/^\/trash/)) return TRASH_DIR_ID
}

export const getFolderUrl = (folderId, location) => {
  if (folderId === ROOT_DIR_ID) return '/files'
  if (folderId === TRASH_DIR_ID) return '/trash'
  let url = location.pathname.match(/^\/files/) ? '/files/' : '/trash/'
  return url + folderId
}

// reconstruct the whole path to the current folder (first element is the root, the last is the current folder)
export const getFolderPath = ({ view }, location) => {
  const { displayedFolder } = view
  let path = []
  let isBrowsingTrash = location.pathname.match(/^\/trash/)
  // dring the first fetch, displayedFolder is null, and we don't want to display anything
  if (displayedFolder) {
    path.push(displayedFolder)
    // does the folder have parents to display? The trash folder has the root folder as parent, but we don't want to show that.
    let parent = displayedFolder.parent
    if (parent && parent.id && !(isBrowsingTrash && parent.id === ROOT_DIR_ID)) {
      path.unshift(parent)
      // has the parent a parent too?
      if (parent.dir_id && !(isBrowsingTrash && parent.dir_id === ROOT_DIR_ID)) {
        // since we don't *actually* have any information about the parent's parent, we have to fake it
        path.unshift({ id: parent.dir_id })
      }
    }
  }
  // finally, we need to make sure we have the root level folder, which can be either the root, or the trash folder. While we're at it, we also rename the folders when we need to.
  let hasRootFolder = path[0] && (path[0].id === ROOT_DIR_ID || path[0].id === TRASH_DIR_ID)
  if (!hasRootFolder) {
    // if we don't have one, we add it manually
    path.unshift({
      id: isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID
    })
  }
  return path
}
