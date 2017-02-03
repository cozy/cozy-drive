import cozy from 'cozy-client-js'

import { ROOT_DIR_ID } from '../constants/config'

export const FETCH_FILES = 'FETCH_FILES'
export const RECEIVE_FILES = 'RECEIVE_FILES'
export const OPEN_FOLDER = 'OPEN_FOLDER'
export const OPEN_FOLDER_SUCCESS = 'OPEN_FOLDER_SUCCESS'
export const OPEN_FOLDER_FAILURE = 'OPEN_FOLDER_FAILURE'
export const ADD_FOLDER = 'ADD_FOLDER'
export const ABORT_ADD_FOLDER = 'ABORT_ADD_FOLDER'
export const CREATE_FOLDER = 'CREATE_FOLDER'
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS'
export const UPLOAD_FILE = 'UPLOAD_FILE'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const DELETE_FILE = 'DELETE_FILE'
export const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
export const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'
export const SELECT_FILE = 'SELECT_FILE'
export const UNSELECT_FILE = 'UNSELECT_FILE'
export const DOWNLOAD_SELECTION = 'DOWNLOAD_SELECTION'
export const SHOW_FILE_ACTIONMENU = 'SHOW_FILE_ACTIONMENU'
export const HIDE_FILE_ACTIONMENU = 'HIDE_FILE_ACTIONMENU'
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE'

const extractFileAttributes = f => Object.assign({}, f.attributes, { id: f._id })
const genId = () => Math.random().toString(36).slice(2)

export const openFolder = (folderId = ROOT_DIR_ID, isInitialFetch = false, router = null) => {
  return async dispatch => {
    if (isInitialFetch) {
      dispatch({ type: FETCH_FILES, folderId })
    }
    dispatch({ type: OPEN_FOLDER, folderId })
    let folder
    try {
      folder = await cozy.files.statById(folderId)
    } catch (err) {
      return dispatch({type: OPEN_FOLDER_FAILURE, error: err})
    }
    const parentId = folder.attributes.dir_id
    let parent
    try {
      parent = !!parentId && await cozy.files.statById(parentId)
    } catch (err) {
      return dispatch({type: OPEN_FOLDER_FAILURE, error: err})
    }

    if (isInitialFetch) {
      dispatch({ type: RECEIVE_FILES, folderId })
    } else if (router) {
      if (folderId === ROOT_DIR_ID) {
        router.push('/files')
      } else {
        router.push(`/files/${folderId}`)
      }
    }
    dispatch({
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
    const created = await cozy.files.create(
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

export const abortAddFolder = () => ({
    type: ABORT_ADD_FOLDER
})

const isDir = attrs => attrs.type === 'directory'

export const renameFile = (newName, attrs) => {
  if (isDir(attrs)) {
    return attrs.isNew === true
      ? createFolder(newName, attrs.id)
      : renameFolder(newName, attrs.id)
  }
}

export const createFolder = (newName, tempId) => {
  return async (dispatch, getState) => {
    dispatch({ type: CREATE_FOLDER, id: tempId })
    const folder = await cozy.files.createDirectory({
      name: newName,
      dirID: getState().folder.id
    })
    dispatch({
      type: CREATE_FOLDER_SUCCESS,
      folder: extractFileAttributes(folder),
      tempId
    })
  }
}

export const deleteFile = (id, isNew = false) => {
  return async (dispatch, getState) => {
    dispatch({ type: DELETE_FILE, id: id })

    if (!isNew) {
      //@TODO: server side deletion
    }
  }
}

export const showSelectionBar = () => ({
  type: SHOW_SELECTION_BAR
})

export const hideSelectionBar = () => ({
  type: HIDE_SELECTION_BAR
})

export const toggleFileSelection = (id, selected) => ({
  type: selected ? UNSELECT_FILE : SELECT_FILE,
  id
})

export const downloadSelection = () => {
  return async (dispatch, getState) => {
    const { selected } = getState().ui
    dispatch({ type: DOWNLOAD_SELECTION, selected })
    selected.forEach(id => dispatch(toggleFileSelection(id, true)))
    return downloadFile(selected[0])
  }
}

export const downloadFile = id => {
  return async (dispatch, getState) => {
    dispatch({ type: DOWNLOAD_FILE, id })
    const response = await cozy.files.downloadById(id)
    const blob = await response.blob()
    // TODO: accessing state in action creators is an antipattern
    const filename = getState().files.find(f => f.id === id).name
    // Temporary trick to force the "download" of the file
    const element = document.createElement('a')
    element.setAttribute('href', window.URL.createObjectURL(blob))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export const showFileActionMenu = id => ({
  type: SHOW_FILE_ACTIONMENU, id
})

export const hideFileActionMenu = () => ({
  type: HIDE_FILE_ACTIONMENU
})

export const renameFolder = (newName, id) => {

}
