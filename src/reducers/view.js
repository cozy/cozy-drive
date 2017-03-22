import { combineReducers } from 'redux'

import {
  LOCATION_CHANGE,
  OPEN_FOLDER_SUCCESS,
  OPEN_FOLDER_FAILURE,
  UPLOAD_FILE_SUCCESS,
  TRASH_FILE_SUCCESS,
  RESTORE_FILE_SUCCESS,
  RENAME_FOLDER,
  CREATE_FOLDER_SUCCESS
} from '../actions'

import { ROOT_DIR_ID, TRASH_DIR_ID, APPS_DIR_PATH } from '../constants/config.js'

const virtualRoot = (state = null, action) => {
  switch (action.type) {
    // there's a trick here : we set the virtualRoot on the LOCATION_CHANGE action
    // so that we have something to display when the app is launched or when the user
    // use the back button
    case LOCATION_CHANGE:
    case OPEN_FOLDER_SUCCESS:
    case OPEN_FOLDER_FAILURE:
      return action.virtualRoot
    default:
      return state
  }
}

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
    case TRASH_FILE_SUCCESS:
    case RESTORE_FILE_SUCCESS:
      return state.filter(f => f.id !== action.id)
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
    // there's another trick here : we set the fetchStatus to 'pending' only on
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
  virtualRoot,
  displayedFolder,
  files,
  fetchStatus,
  lastFetch
})

const sortFiles = files => files.sort((a, b) => a.name.localeCompare(b.name))

const getSortedFiles = allFiles => {
  let folders = allFiles.filter(f => f.type === 'directory' && f.id !== TRASH_DIR_ID && f.path !== APPS_DIR_PATH)
  let files = allFiles.filter(f => f.type !== 'directory')
  return sortFiles(folders).concat(sortFiles(files))
}

export const getVisibleFiles = ({ view }) => {
  const { files } = view
  return getSortedFiles(files)
}

export const getVirtualRootFromUrl = pathname => {
  if (pathname.match(/^\/files/)) return ROOT_DIR_ID
  if (pathname.match(/^\/trash/)) return TRASH_DIR_ID
}

export const getUrlFromParams = ({ virtualRoot, displayedFolder }) => {
  let path = virtualRoot === TRASH_DIR_ID ? '/trash' : '/files'
  if (displayedFolder && displayedFolder.id !== virtualRoot) {
    path += `/${displayedFolder.id}`
  }
  return path
}
