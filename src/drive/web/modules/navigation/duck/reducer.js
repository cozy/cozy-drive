import { combineReducers } from 'redux'
import pull from 'lodash/pull'

import {
  OPEN_FOLDER,
  OPEN_FOLDER_SUCCESS,
  OPEN_FOLDER_FAILURE,
  SORT_FOLDER,
  SORT_FOLDER_SUCCESS,
  SORT_FOLDER_FAILURE,
  FETCH_RECENT,
  FETCH_RECENT_SUCCESS,
  FETCH_RECENT_FAILURE,
  FETCH_SHARINGS,
  FETCH_SHARINGS_SUCCESS,
  FETCH_SHARINGS_FAILURE,
  FETCH_MORE_FILES_SUCCESS,
  TRASH_FILES_SUCCESS,
  CREATE_FOLDER_SUCCESS,
  ADD_FILE,
  UPDATE_FILE,
  DELETE_FILE
} from './actions'

import {
  EMPTY_TRASH,
  EMPTY_TRASH_SUCCESS,
  EMPTY_TRASH_FAILURE,
  RESTORE_FILES_SUCCESS,
  DESTROY_FILES_SUCCESS
} from 'drive/web/modules/trash/actions'
import { RENAME_SUCCESS } from 'drive/web/modules/drive/rename'
import { isDirectory } from 'drive/web/modules/drive/files'

import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config.js'

const hasDisplayedSomething = (state = false, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
      return true
    default:
      return state
  }
}

const isOpening = (state = false, action) => {
  switch (action.type) {
    case OPEN_FOLDER:
    case FETCH_RECENT:
    case FETCH_SHARINGS:
      return true
    case OPEN_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
    case FETCH_SHARINGS_SUCCESS:
      return false
    default:
      return state
  }
}

export const isNavigating = ({ view }) =>
  view.hasDisplayedSomething && view.isOpening

// reducer for the currently displayed folder properties
const displayedFolder = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      return action.folder
    case FETCH_RECENT_SUCCESS:
    case FETCH_SHARINGS_SUCCESS:
      return null
    default:
      return state
  }
}

const currentView = (state = '', action) => {
  switch (action.type) {
    case OPEN_FOLDER:
      if (action.folderId === 'io.cozy.files.trash-dir') {
        return 'trash'
      }
      return 'folder'
    case FETCH_RECENT:
      return 'recent'
    case FETCH_SHARINGS:
      return 'sharings'
    default:
      return state
  }
}

const openedFolderId = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER:
      return action.folderId
    case FETCH_RECENT:
    case FETCH_SHARINGS:
      return null
    default:
      return state
  }
}

const fileCount = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
    case FETCH_SHARINGS_SUCCESS:
      return action.fileCount
    case CREATE_FOLDER_SUCCESS:
    case ADD_FILE:
      return state + 1
    case DELETE_FILE:
      return state - 1
    case TRASH_FILES_SUCCESS:
    case DESTROY_FILES_SUCCESS:
      return state - action.ids.length
    // This looks counter-intuitive to decrement the file count here,
    // but we're in the trash, so when we restore files from the trash,
    // the file count of the trash decrements
    case RESTORE_FILES_SUCCESS:
      return state - action.ids.length
    default:
      return state
  }
}

const sort = (state = null, action) => {
  switch (action.type) {
    case SORT_FOLDER:
      return {
        attribute: action.sortAttribute,
        order: action.sortOrder
      }
    case FETCH_RECENT_SUCCESS:
      return { attribute: 'updated_at', order: 'desc' }
    case OPEN_FOLDER_SUCCESS:
    case FETCH_SHARINGS_SUCCESS:
      return null
    default:
      return state
  }
}

const updateItem = (file, files) => {
  const existingFile = files.find(f => f.id === file.id)
  const index = files.indexOf(existingFile)
  const toRemove = index >= 0 ? 1 : 0
  const filesCopy = files.slice()
  filesCopy.splice(index, toRemove, file)
  return filesCopy
}

const getCompareFn = (currentSort = null) => {
  const sort = currentSort || { attribute: 'name', order: 'asc' }
  if (sort.attribute === 'updated_at') {
    return (a, b) => {
      const ta = new Date(a.updated_at).getTime()
      const tb = new Date(b.updated_at).getTime()
      return sort.order === 'desc' ? (ta > tb ? -1 : 1) : ta > tb ? 1 : -1
    }
  }
  // We always return the compare fn for name by default, so
  // that adding new sorting fields will not break this function (it
  // will need to be updated though)
  return (a, b) => {
    if (a.type !== b.type) {
      return isDirectory(a) ? -1 : 1
    }
    return sort.order === 'desc'
      ? b.name.localeCompare(a.name)
      : a.name.localeCompare(b.name)
  }
}

const insertItem = (file, array, currentItemCount, currentSort = null) => {
  if (array.find(f => f.id === file.id)) return array

  const index = indexFor(file, array, getCompareFn(currentSort))
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
const files = (
  state = { shared: [], recent: [], trashed: [], folder: [] },
  action
) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
      if (action.folder.id === 'io.cozy.files.trash-dir') {
        return {
          ...state,
          trashed: action.files
        }
      }
      return {
        ...state,
        folder: action.files
      }
    case FETCH_RECENT_SUCCESS:
      return {
        ...state,
        recent: action.files
      }
    case FETCH_SHARINGS_SUCCESS:
      return {
        ...state,
        shared: action.files
      }
    case SORT_FOLDER_SUCCESS:
      return {
        ...state,
        folder: action.files
      }
    case FETCH_MORE_FILES_SUCCESS: {
      const clone = state.folder.slice(0)
      action.files.forEach((f, i) => {
        clone[action.skip + i] = f
      })

      return {
        ...state,
        folder: clone
      }
    }
    case RENAME_SUCCESS:
    case UPDATE_FILE: {
      const newStateFile = updateItem(action.file, state.folder)
      return {
        ...state,
        folder: newStateFile
      }
    }
    case ADD_FILE: {
      const newFolderState = insertItem(
        action.file,
        state.folder,
        action.currentFileCount,
        action.currentSort
      )
      return {
        ...state,
        folder: newFolderState
      }
    }
    case CREATE_FOLDER_SUCCESS: {
      const newFolderState = insertItem(
        action.folder,
        state.folder,
        action.currentFileCount,
        action.currentSort
      )
      return {
        ...state,
        folder: newFolderState
      }
    }
    case TRASH_FILES_SUCCESS:
    case RESTORE_FILES_SUCCESS:
    case DESTROY_FILES_SUCCESS:
      return {
        ...state,
        trashed: state.trashed.filter(f => action.ids.indexOf(f.id) === -1)
      }
    case DELETE_FILE:
      return {
        ...state,
        folder: state.folder.filter(f => action.file.id !== f.id)
      }
    case EMPTY_TRASH_SUCCESS:
      return {
        ...state,
        trashed: []
      }
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
    case SORT_FOLDER:
      return 'pending'
    case OPEN_FOLDER_SUCCESS:
    case SORT_FOLDER_SUCCESS:
    case FETCH_RECENT_SUCCESS:
    case FETCH_SHARINGS_SUCCESS:
    case EMPTY_TRASH_SUCCESS:
    case EMPTY_TRASH_FAILURE:
      return 'loaded'
    case OPEN_FOLDER_FAILURE:
    case SORT_FOLDER_FAILURE:
    case FETCH_RECENT_FAILURE:
    case FETCH_SHARINGS_FAILURE:
      return 'failed'
    default:
      return state
  }
}

const lastFetch = (state = null, action) => {
  switch (action.type) {
    case OPEN_FOLDER_SUCCESS:
    case OPEN_FOLDER_FAILURE:
    case SORT_FOLDER_SUCCESS:
    case SORT_FOLDER_FAILURE:
    case FETCH_RECENT_SUCCESS:
    case FETCH_RECENT_FAILURE:
    case FETCH_SHARINGS_SUCCESS:
    case FETCH_SHARINGS_FAILURE:
      return Date.now()
    default:
      return state
  }
}

const deduplicateCreateDeleteActions = originalReducer => {
  const created = []
  const deleted = []

  const deduplicateCreateAction = (state, action) => {
    const doc = action.file || action.folder
    if (created.includes(doc.id)) return state
    else {
      created.push(doc.id)
      pull(deleted, doc.id)
      return originalReducer(state, action)
    }
  }

  const deduplicateDeleteAction = (state, action) => {
    const actionIds = action.ids || [action.file.id]
    const toRemove = actionIds.filter(id => !deleted.includes(id))

    if (toRemove.length === 0) return state
    else {
      deleted.push(...toRemove)
      pull(created, ...toRemove)
      action.ids = toRemove
      return originalReducer(state, action)
    }
  }

  const clearInternalCache = (state, action) => {
    created.length = 0
    deleted.length = 0
    return originalReducer(state, action)
  }

  return (state, action) => {
    switch (action.type) {
      case CREATE_FOLDER_SUCCESS:
      case ADD_FILE:
        return deduplicateCreateAction(state, action)
      case DELETE_FILE:
      case TRASH_FILES_SUCCESS:
      case DESTROY_FILES_SUCCESS:
      case RESTORE_FILES_SUCCESS:
        return deduplicateDeleteAction(state, action)
      case OPEN_FOLDER_SUCCESS:
      case FETCH_RECENT_SUCCESS:
      case FETCH_SHARINGS_SUCCESS:
        return clearInternalCache(state, action)
      default:
        return originalReducer(state, action)
    }
  }
}

export default combineReducers({
  hasDisplayedSomething,
  isOpening,
  displayedFolder,
  openedFolderId,
  fileCount: deduplicateCreateDeleteActions(fileCount),
  sort,
  files,
  fetchStatus,
  lastFetch,
  currentView
})

// TODO: temp
export const getFilesWithLinks = ({ view }, folderId) =>
  view.filesWithLinks[folderId]

export const getVisibleFiles = ({ view }) => {
  return getCurrentFilesIndex(view).map(f => ensureFileHavePath({ view }, f))
}

export const getSort = ({ view }) => view.sort

export const getCurrentFilesIndex = view => {
  switch (view.currentView) {
    case 'folder':
      return view.files.folder
    case 'recent':
      return view.files.recent
    case 'sharings':
      return view.files.shared
    case 'trash':
      return view.files.trashed
    default:
      return view.files.folder
  }
}
export const getFileById = ({ view }, id) => {
  const file = getCurrentFilesIndex(view).find(f => f && f.id && f.id === id)
  if (!file) return null
  // we need the path for some actions, like selection download
  // but the stack only provides the path for folders...
  return ensureFileHavePath({ view }, file)
}

const isRootFolder = folder => folder.id === ROOT_DIR_ID

export const ensureFileHavePath = ({ view }, file) => ({
  ...file,
  displayedPath: getDisplayedFilePath({ view }, file),
  path: getFilePath({ view }, file)
})

/*
  TODO: deprecate and remove getFilePath
*/
export const getFilePath = ({ view }, file) => {
  const { displayedFolder } = view
  if (isDirectory(file)) {
    return file.path
  } else {
    const folderPath = displayedFolder
      ? !isRootFolder(displayedFolder)
        ? displayedFolder.path
        : ''
      : file.path // file.path is the parent folder path
    return `${folderPath}/${file.name}`
  }
}

export const getDisplayedFilePath = ({ view }, file) => {
  const { displayedFolder } = view
  return file.path || (displayedFolder ? displayedFolder.path : '')
}

export const getOpenedFolderId = state => state.view.openedFolderId

export const getFolderIdFromRoute = (location, params) => {
  if (params.folderId) return params.folderId
  if (location.pathname.match(/^\/folder/)) return ROOT_DIR_ID
  if (location.pathname.match(/^\/trash/)) return TRASH_DIR_ID
}

const getFolderUrlFromPathName = pathname => {
  if (pathname.match(/^\/sharings/)) return '/sharings/'
  else if (pathname.match(/^\/trash/)) return '/trash/'
  else return '/folder/'
}

export const getFolderUrl = (folderId, location) => {
  if (folderId === undefined) return '/folder'
  if (folderId === ROOT_DIR_ID) return '/folder'
  if (folderId === TRASH_DIR_ID) return '/trash'
  return getFolderUrlFromPathName(location.pathname) + folderId
}
