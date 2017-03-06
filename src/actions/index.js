/* global cozy */
import { ROOT_DIR_ID } from '../constants/config'
import { saveFileWithCordova, openFileWithCordova } from '../../mobile/src/lib/filesystem'
import { openWithOfflineError, openWithNoAppError } from '../../mobile/src/actions'
import { getFilePaths, getFileById } from '../reducers'

export const FETCH_FILES = 'FETCH_FILES'
export const RECEIVE_FILES = 'RECEIVE_FILES'
export const OPEN_FOLDER = 'OPEN_FOLDER'
export const OPEN_FOLDER_SUCCESS = 'OPEN_FOLDER_SUCCESS'
export const OPEN_FOLDER_FAILURE = 'OPEN_FOLDER_FAILURE'
export const ADD_FOLDER = 'ADD_FOLDER'
export const ABORT_ADD_FOLDER = 'ABORT_ADD_FOLDER'
export const RENAME_FOLDER = 'RENAME_FOLDER'
export const CREATE_FOLDER = 'CREATE_FOLDER'
export const CREATE_FOLDER_FAILURE_GENERIC = 'CREATE_FOLDER_FAILURE_GENERIC'
export const CREATE_FOLDER_FAILURE_DUPLICATE = 'CREATE_FOLDER_FAILURE_DUPLICATE'
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS'
export const UPLOAD_FILE = 'UPLOAD_FILE'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const DELETE_FILE = 'DELETE_FILE'
export const TRASH_FILE = 'TRASH_FILE'
export const TRASH_FILE_SUCCESS = 'TRASH_FILE_SUCCESS'
export const TRASH_FILE_FAILURE = 'TRASH_FILE_FAILURE'
export const RESTORE_FILE = 'RESTORE_FILE'
export const RESTORE_FILE_SUCCESS = 'RESTORE_FILE_SUCCESS'
export const RESTORE_FILE_FAILURE = 'RESTORE_FILE_FAILURE'
export const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
export const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'
export const SHOW_DELETE_CONFIRMATION = 'SHOW_DELETE_CONFIRMATION'
export const HIDE_DELETE_CONFIRMATION = 'HIDE_DELETE_CONFIRMATION'
export const SELECT_FILE = 'SELECT_FILE'
export const UNSELECT_FILE = 'UNSELECT_FILE'
export const DOWNLOAD_SELECTION = 'DOWNLOAD_SELECTION'
export const SHOW_FILE_ACTIONMENU = 'SHOW_FILE_ACTIONMENU'
export const HIDE_FILE_ACTIONMENU = 'HIDE_FILE_ACTIONMENU'
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE'
export const DOWNLOAD_FILE_E_MISSING = 'DOWNLOAD_FILE_E_MISSING'
export const DOWNLOAD_FILE_E_OFFLINE = 'DOWNLOAD_FILE_E_OFFLINE'
export const OPEN_FILE_WITH = 'OPEN_FILE_WITH'
export const OPEN_FILE_E_OFFLINE = 'OPEN_FILE_E_OFFLINE'
export const OPEN_FILE_E_NO_APP = 'OPEN_FILE_E_NO_APP'
export const ALERT_CLOSED = 'ALERT_CLOSED'

const extractFileAttributes = f => Object.assign({}, f.attributes, { id: f._id })
const genId = () => Math.random().toString(36).slice(2)

export const HTTP_CODE_CONFLICT = 409
const ALERT_TYPE_ERROR = 'error'

export const downloadFileMissing = () => ({ type: DOWNLOAD_FILE_E_MISSING, alert: { message: 'error.download_file.missing', type: ALERT_TYPE_ERROR } })
export const downloadFileOffline = () => ({ type: DOWNLOAD_FILE_E_OFFLINE, alert: { message: 'error.download_file.offline', type: ALERT_TYPE_ERROR } })

export const openFolder = (folderId = ROOT_DIR_ID, isInitialFetch = false, router = null) => {
  return async dispatch => {
    let routePrefix = '/files'
    // We're probably going to push a new route to the history, but we need to find the "base" of the url, eg. /files or /trash.
    if (router && router.location.pathname.indexOf('/') > -1) {
      routePrefix = '/' + router.location.pathname.split('/')[1]
    }

    if (isInitialFetch) {
      dispatch({ type: FETCH_FILES, folderId })
    }
    dispatch({ type: OPEN_FOLDER, folderId })
    let folder, parent
    try {
      folder = await cozy.client.files.statById(folderId)
      const parentId = folder.attributes.dir_id
      parent = !!parentId && await cozy.client.files.statById(parentId)
    } catch (err) {
      if (!isInitialFetch && router) {
        router.push(folderId === ROOT_DIR_ID ? routePrefix : routePrefix + `/${folderId}`)
      }
      return dispatch({type: OPEN_FOLDER_FAILURE, error: err})
    }
    if (isInitialFetch) {
      dispatch({ type: RECEIVE_FILES, folderId })
    } else if (router) {
      router.push(folderId === ROOT_DIR_ID ? routePrefix : routePrefix + `/${folderId}`)
    }
    return dispatch({
      type: OPEN_FOLDER_SUCCESS,
      folder: Object.assign(extractFileAttributes(folder), {
        parent: extractFileAttributes(parent)}),
      files: folder.relations('contents').map(
        c => extractFileAttributes(c)
      )
    })
  }
}

export const uploadFile = (file) => {
  return async (dispatch, getState) => {
    dispatch({ type: UPLOAD_FILE })
    const created = await cozy.client.files.create(
      file,
      { dirID: getState().folder.id }
    )
    dispatch({
      type: UPLOAD_FILE_SUCCESS,
      file: extractFileAttributes(created)
    })
  }
}

export const addFolder = () => ({
  type: ADD_FOLDER,
  folder: {
    id: genId(),
    name: '',
    type: 'directory',
    created_at: Date.now(),
    isNew: true
  }
})

export const abortAddFolder = (accidental) => {
  let action = {
    type: ABORT_ADD_FOLDER,
    accidental
  }

  if (accidental) {
    action.alert = {
      message: 'alert.folder_abort'
    }
  }

  return action
}

export const renameFolder = (newName, id) => ({
  type: RENAME_FOLDER,
  id,
  name: newName
})

export const createFolder = (name, tempId) => {
  return async (dispatch, getState) => {
    let existingFolder = getState().files.find(f => f.id !== tempId && f.type === 'directory' && f.name === name)

    if (existingFolder) {
      return dispatch({
        type: CREATE_FOLDER_FAILURE_DUPLICATE,
        id: tempId,
        alert: {
          message: 'alert.folder_name',
          messageData: { folderName: name }
        }
      })
    }

    dispatch({
      type: CREATE_FOLDER,
      id: tempId
    })

    let folder
    try {
      folder = await cozy.client.files.createDirectory({
        name: name,
        dirID: getState().folder.id
      })
    } catch (err) {
      if (err.response && err.response.status === HTTP_CODE_CONFLICT) {
        dispatch({
          type: CREATE_FOLDER_FAILURE_DUPLICATE,
          id: tempId,
          alert: {
            message: 'alert.folder_name',
            messageData: { folderName: name }
          }
        })
      } else {
        dispatch({
          type: CREATE_FOLDER_FAILURE_GENERIC,
          id: tempId,
          alert: {
            message: 'alert.folder_generic'
          }
        })
      }
      return
    }
    dispatch({
      type: CREATE_FOLDER_SUCCESS,
      folder: extractFileAttributes(folder),
      tempId
    })
  }
}

export const deleteFileOrFolder = (id, isNew = false) => {
  return async (dispatch, getState) => {
    dispatch({ type: DELETE_FILE, id: id })

    if (!isNew) {
      // @TODO: server side deletion
    }
  }
}

export const trashFile = id => {
  return async dispatch => {
    dispatch({ type: TRASH_FILE, id: id })
    let trashed
    try {
      trashed = await cozy.client.files.trashById(id)
    } catch (err) {
      return dispatch({
        type: TRASH_FILE_FAILURE,
        alert: {
          message: 'alert.try_again'
        }
      })
    }
    dispatch({
      type: TRASH_FILE_SUCCESS,
      file: extractFileAttributes(trashed),
      id,
      alert: {
        message: 'alert.trash_file_success'
      }
    })
  }
}

export const restoreFile = id => {
  return async dispatch => {
    dispatch({ type: RESTORE_FILE, id: id })
    let restored
    try {
      restored = await cozy.client.files.restoreById(id)
    } catch (err) {
      return dispatch({
        type: RESTORE_FILE_FAILURE,
        alert: {
          message: 'alert.try_again'
        }
      })
    }
    dispatch({
      type: RESTORE_FILE_SUCCESS,
      file: extractFileAttributes(restored),
      id,
      alert: {
        message: 'alert.restore_file_success'
      }
    })
  }
}

export const showSelectionBar = () => ({
  type: SHOW_SELECTION_BAR
})

export const hideSelectionBar = () => ({
  type: HIDE_SELECTION_BAR
})

export const showDeleteConfirmation = () => ({
  type: SHOW_DELETE_CONFIRMATION
})

export const hideDeleteConfirmation = () => ({
  type: HIDE_DELETE_CONFIRMATION
})

export const toggleFileSelection = (id, selected) => ({
  type: selected ? UNSELECT_FILE : SELECT_FILE,
  id
})

export const downloadSelection = () => {
  return async (dispatch, getState) => {
    const { selected } = getState().ui
    dispatch({ type: DOWNLOAD_SELECTION, selected })
    if (selected.length === 1 && getFileById(getState().files, selected[0]).type !== 'directory') {
      return dispatch(downloadFile(selected[0]))
    }
    const paths = getFilePaths(getState(), selected)
    const href = await cozy.client.files.getArchiveLink(paths)
    const fullpath = await cozy.client.fullpath(href)
    forceFileDownload(fullpath, 'files.zip')
  }
}

const isMissingFile = (error) => error.status === 404
const isOffline = (error) => error.message === 'Network request failed'

export const downloadFile = id => {
  return async (dispatch, getState) => {
    dispatch({ type: DOWNLOAD_FILE, id })
    const response = await cozy.client.files.downloadById(id).catch((error) => {
      console.error('downloadById', error)
      if (isMissingFile(error)) {
        dispatch(downloadFileMissing())
      } else if (isOffline(error)) {
        dispatch(downloadFileOffline())
      } else {
        dispatch(downloadFileOffline())
      }
      throw error
    })
    const blob = await response.blob()
    // TODO: accessing state in action creators is an antipattern
    const filename = getState().files.find(f => f.id === id).name

    if (window.cordova && window.cordova.file) {
      saveFileWithCordova(blob, filename)
    } else {
      forceFileDownload(window.URL.createObjectURL(blob), filename)
    }
  }
}

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const openFileWith = (id, filename) => {
  return async (dispatch, getState) => {
    if (window.cordova && window.cordova.plugins.fileOpener2) {
      dispatch({ type: OPEN_FILE_WITH, id })
      const response = await cozy.client.files.downloadById(id).catch((error) => {
        console.error('downloadById', error)
        if (isMissingFile(error)) {
          dispatch(downloadFileMissing())
        } else if (isOffline(error)) {
          dispatch(openWithOfflineError())
        } else {
          dispatch(openWithOfflineError())
        }
        throw error
      })
      const blob = await response.blob()
      openFileWithCordova(blob, filename).catch((error) => {
        console.error('openFileWithCordova', error)
        dispatch(openWithNoAppError())
      })
    } else {
      dispatch(openWithNoAppError())
    }
  }
}

export const showFileActionMenu = id => ({
  type: SHOW_FILE_ACTIONMENU, id
})

export const hideFileActionMenu = () => ({
  type: HIDE_FILE_ACTIONMENU
})

export const alertClosed = () => ({
  type: ALERT_CLOSED
})

export const actionMenuLoading = (menu) => ({
  type: 'SHOW_SPINNER',
  menu
})

export const actionMenuLoaded = (menu) => ({
  type: 'HIDE_SPINNER',
  menu
})
