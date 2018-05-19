/* global cozy */

import { getFiles } from './files'
import { META_DEFAULTS as meta } from '../../actions'
import { extractFileAttributes } from '../../actions/async.js'

// constants

const START_RENAMING = 'START_RENAMING'
const ABORT_RENAMING = 'ABORT_RENAMING'
export const RENAME_SUCCESS = 'RENAME_SUCCESS'
const UPDATE_FILE_NAME = 'UPDATE_FILE_NAME'
const RENAME_FAILURE_DUPLICATE = 'RENAME_FAILURE_DUPLICATE'

// reducers

const initialState = { file: null, name: null }
const renameReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_RENAMING:
      return { ...state, file: action.file, name: action.file.name }
    case UPDATE_FILE_NAME:
      return { ...state, name: action.name }
    case RENAME_SUCCESS:
    case ABORT_RENAMING:
      return initialState
    default:
      return state
  }
}
export default renameReducer

// selectors

export const isRenaming = state => state.rename !== initialState
export const getRenamingFile = state => state.rename.file
export const getUpdatedName = state => state.rename.name

// action creators sync

export const startRenaming = file => ({ type: START_RENAMING, file, meta })
export const updateFileName = name => ({ type: UPDATE_FILE_NAME, name })
export const abortRenaming = () => ({ type: ABORT_RENAMING })
export const renamed = file => ({ type: RENAME_SUCCESS, file })
export const renameFailureDuplicate = name => ({
  type: RENAME_FAILURE_DUPLICATE,
  alert: {
    message: 'alert.folder_name',
    messageData: { folderName: name }
  }
})

// action creators async

export const startRenamingAsync = file => async dispatch => {
  await dispatch(startRenaming(file))
}

export const rename = () => async (dispatch, getState) => {
  const state = getState()
  const files = getFiles(state)
  const renamingFile = getRenamingFile(state)
  const updatedName = getUpdatedName(state)
  const isExisting = files.find(f => f.name === updatedName)

  if (isExisting) {
    if (isExisting.id === renamingFile.id) {
      dispatch(abortRenaming())
      return
    } else {
      dispatch(renameFailureDuplicate(updatedName))
      throw new Error('alert.folder_name')
    }
  }
  try {
    const updated = await cozy.client.files.updateAttributesById(
      renamingFile.id,
      { name: updatedName }
    )
    dispatch(renamed(extractFileAttributes(updated)))
  } catch (e) {
    console.warn(e)
  }
}
