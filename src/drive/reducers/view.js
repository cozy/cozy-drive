import { combineReducers } from 'redux'

import {
  OPEN_FOLDER,
  OPEN_FOLDER_SUCCESS,
  OPEN_FOLDER_FAILURE,
  FETCH_RECENT,
  FETCH_RECENT_SUCCESS,
  FETCH_RECENT_FAILURE,
  FETCH_MORE_FILES_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  TRASH_FILES_SUCCESS,
  CREATE_FOLDER_SUCCESS
} from '../actions'

import {
  EMPTY_TRASH,
  EMPTY_TRASH_SUCCESS,
  EMPTY_TRASH_FAILURE,
  RESTORE_FILES_SUCCESS,
  DESTROY_FILES,
  DESTROY_FILES_SUCCESS,
  DESTROY_FILES_FAILURE
} from '../ducks/trash'
import { RENAME_SUCCESS } from '../ducks/files/rename'
import { isDirectory } from '../ducks/files/files'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config.js'

// reducer for the currently displayed folder properties
const displayedFolder = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      return action.folder
    case FETCH_RECENT_SUCCESS:
      return null
    default:
      return state
  }
}

const openedFolderId = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER:
      return action.folderId
    case FETCH_RECENT:
      return null
    default:
      return state
  }
}

const fileCount = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
      return action.fileCount
    case UPLOAD_FILE_SUCCESS:
    case CREATE_FOLDER_SUCCESS:
      return state + 1
    case TRASH_FILES_SUCCESS:
    case DESTROY_FILES_SUCCESS:
      return state - action.ids.length
    case RESTORE_FILES_SUCCESS:
      return state + action.ids.length
    default:
      return state
  }
}

const updateItem = (file, files) => {
  const withoutFile = files.filter(f => f.id !== file.id)
  return insertItem(file, withoutFile)
}

const insertItem = (file, array, currentItemCount) => {
  const index = indexFor(file, array, (a, b) => {
    if (a.type !== b.type) {
      return isDirectory(a) ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
  // if we only have partially fetched the file list and the new item
  // position is in the unfetched part of the list, we don't add the item
  // to the list
  if (index === array.length - 1 && array.length < currentItemCount) {
    return array
  }
  return [...array.slice(0, index + 1), file, ...array.slice(index + 1)]
}

const indexFor = (file, array, compareFn, start = 0, end = array.length) => {
  if (array.length === 0) return -1
  const pivot = parseInt(start + (end - start) / 2, 10)
  const c = compareFn(file, array[pivot])
  if (end - start <= 1) return c === -1 ? pivot - 1 : pivot
  switch (c) {
    case -1:
      return indexFor(file, array, compareFn, start, pivot)
    case 0:
      return pivot
    case 1:
      return indexFor(file, array, compareFn, pivot, end)
  }
}

// reducer for the full file list of the currently displayed folder
const files = (state = [], action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
      return action.files
    case FETCH_MORE_FILES_SUCCESS:
      const clone = state.slice(0)
      action.files.forEach((f, i) => {
        clone[action.skip + i] = f
      })
      return clone
    case RENAME_SUCCESS:
      return updateItem(action.file, state)
    case UPLOAD_FILE_SUCCESS:
      return insertItem(action.file, state)
    case CREATE_FOLDER_SUCCESS:
      return insertItem(action.folder, state, action.currentFileCount)
    case TRASH_FILES_SUCCESS:
    case RESTORE_FILES_SUCCESS:
    case DESTROY_FILES_SUCCESS:
      return state.filter(f => action.ids.indexOf(f.id) === -1)
    case EMPTY_TRASH_SUCCESS:
      return []
    default:
      return state
  }
}

const fetchStatus = (state = 'pending', action) => {
  switch (action.type) {
    // there's a trick here : we set the fetchStatus to 'pending'
    // on initial state so that the loading spinner is only showed
    // when the app is launched or when the user use the back button
    case EMPTY_TRASH: // we temporarily display the spinner when working in the trashed
    case DESTROY_FILES: // TODO: display a spinner in the confirm modal instead
      return 'pending'
    case OPEN_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
    case EMPTY_TRASH_SUCCESS:
    case EMPTY_TRASH_FAILURE:
    case DESTROY_FILES_SUCCESS:
    case DESTROY_FILES_FAILURE:
      return 'loaded'
    case OPEN_FOLDER_FAILURE:
    case FETCH_RECENT_FAILURE:
      return 'failed'
    default:
      return state
  }
}

const lastFetch = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case OPEN_FOLDER_FAILURE:
    case FETCH_RECENT_SUCCESS:
    case FETCH_RECENT_FAILURE:
      return Date.now()
    default:
      return state
  }
}

export default combineReducers({
  displayedFolder,
  openedFolderId,
  fileCount,
  files,
  fetchStatus,
  lastFetch
})

export const getVisibleFiles = ({ view }) => view.files

export const getFileById = ({ view }, id) => {
  const file = view.files.find(f => f && f.id && f.id === id)
  if (!file) return null
  // we need the path for some actions, like selection download
  // but the stack only provides the path for folders...
  return Object.assign({}, file, { path: getFilePath({ view }, file) })
}

const isRootFolder = folder => folder.id === ROOT_DIR_ID

export const getFilePath = ({ view }, file) => {
  const { displayedFolder } = view
  return isDirectory(file)
    ? file.path
    : displayedFolder && !isRootFolder(displayedFolder)
      ? `${displayedFolder.path}/${file.name}`
      : `/${file.name}`
}

export const getFolderIdFromRoute = (location, params) => {
  if (params.folderId) return params.folderId
  if (location.pathname.match(/^\/folder/)) return ROOT_DIR_ID
  if (location.pathname.match(/^\/trash/)) return TRASH_DIR_ID
}

export const getFolderUrl = (folderId, location) => {
  if (folderId === ROOT_DIR_ID) return '/folder'
  if (folderId === TRASH_DIR_ID) return '/trash'
  const url = location.pathname.match(/^\/folder/) ? '/folder/' : '/trash/'
  return url + folderId
}

// reconstruct the whole path to the current folder (first element is the root, the last is the current folder)
export const getFolderPath = ({ view }, location, isPublic) => {
  const { displayedFolder } = view
  const path = []
  const isBrowsingTrash = /^\/trash/.test(location.pathname)
  const isBrowsingRecentFiles = /^\/recent/.test(location.pathname)
  // dring the first fetch, displayedFolder is null, and we don't want to display anything
  if (displayedFolder) {
    path.push(displayedFolder)
    // does the folder have parents to display? The trash folder has the root folder as parent, but we don't want to show that.
    const parent = displayedFolder.parent
    if (
      parent &&
      parent.id &&
      !(isBrowsingTrash && parent.id === ROOT_DIR_ID)
    ) {
      path.unshift(parent)
      // has the parent a parent too?
      if (
        parent.dir_id &&
        !(isBrowsingTrash && parent.dir_id === ROOT_DIR_ID) &&
        !isPublic
      ) {
        // since we don't *actually* have any information about the parent's parent, we have to fake it
        path.unshift({ id: parent.dir_id })
      }
    }
  }
  if (isPublic) {
    return path
  }
  // finally, we need to make sure we have the root level folder, which can be either the root, or the trash folder.
  if (!isBrowsingRecentFiles) {
    const hasRootFolder =
      path[0] && (path[0].id === ROOT_DIR_ID || path[0].id === TRASH_DIR_ID)
    if (!hasRootFolder) {
      // if we don't have one, we add it manually
      path.unshift({
        id: isBrowsingTrash ? TRASH_DIR_ID : ROOT_DIR_ID
      })
    }
  }
  return path
}
