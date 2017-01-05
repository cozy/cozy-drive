import cozy from 'cozy-client-js'

export const ROOT_DIR_ID = 'io.cozy.files.root-dir'

export const FETCH_FILES = 'FETCH_FILES'
export const RECEIVE_FILES = 'RECEIVE_FILES'
export const ADD_FOLDER = 'ADD_FOLDER'
export const CREATE_FOLDER = 'CREATE_FOLDER'
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS'
export const UPLOAD_FILE = 'UPLOAD_FILE'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'

const extractFileAttributes = f => Object.assign({}, f.attributes, { id: f._id })

export const fetchFiles = (folderId = ROOT_DIR_ID) => {
  return async dispatch => {
    dispatch({ type: FETCH_FILES })
    const folder = await cozy.files.statById(folderId)
    dispatch({
      type: RECEIVE_FILES,
      folder: extractFileAttributes(folder),
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

export const addFolder = () => ({ type: ADD_FOLDER })

export const createFolder = (newName) => {
  return async (dispatch, getState) => {
    dispatch({ type: CREATE_FOLDER })
    const folder = await cozy.files.createDirectory({
      name: newName,
      dirID: getState().folder.id
    })
    dispatch({ type: CREATE_FOLDER_SUCCESS, folder: extractFileAttributes(folder) })
  }
}
