/* global cozy */

// constants

export const SET_SAVE_FOLDER = 'SET_SAVE_FOLDER'
export const CREATE_SAVE_FOLDER_SUCCESS = 'CREATE_SAVE_FOLDER_SUCCESS'

// selectors

const getFolder = (state, path) => state.backup.folders[path] ? state.backup.folders[path] : undefined

// reducers

const saveFolder = (state = {}, action) => {
  switch (action.type) {
    case SET_SAVE_FOLDER:
    case CREATE_SAVE_FOLDER_SUCCESS:
      delete action.folder.relations // it's not possible to serialize function
      return { ...state, [action.path]: action.folder }
    default:
      return state
  }
}

// actions

const createdFolderSuccess = (path, folder) => ({ type: CREATE_SAVE_FOLDER_SUCCESS, path, folder })

// actions async

export const createFolder = (path) => async (dispatch, getState) => {
  const folder = await cozy.client.files.createDirectoryByPath(path)
  dispatch(createdFolderSuccess(path, folder))

  return folder
}

export const getOrCreateFolder = (path) => async (dispatch, getState) => {
  const folder = getFolder(getState(), path)
  if (folder) {
    return folder
  }

  return dispatch(createFolder(path))
}

export default saveFolder
