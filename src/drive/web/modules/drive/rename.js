/* global cozy */
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { getVisibleFiles } from 'drive/web/modules/navigation/duck'

// TODO: Not cool to have to do this... Code below should probably be moved into the local state
// of the RenameInput
import { META_DEFAULTS as meta } from 'drive/web/modules/navigation/duck/actions'
import { extractFileAttributes } from 'drive/web/modules/navigation/duck/async'

import logger from 'lib/logger'
// constants

const START_RENAMING = 'START_RENAMING'
const ABORT_RENAMING = 'ABORT_RENAMING'
export const RENAME_SUCCESS = 'RENAME_SUCCESS'
const UPDATE_FILE_NAME = 'UPDATE_FILE_NAME'

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

// action creators async

export const startRenamingAsync = file => async dispatch => {
  await dispatch(startRenaming(file))
}

export const rename = () => async (dispatch, getState) => {
  const state = getState()
  const files = getVisibleFiles(state)
  const renamingFile = getRenamingFile(state)
  const updatedName = getUpdatedName(state)
  const isExisting = files.find(f => f.name === updatedName)

  if (isExisting) {
    if (isExisting.id === renamingFile.id) {
      dispatch(abortRenaming())
      return
    } else {
      Alerter.error('alert.folder_name', { folderName: name })
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
    logger.warn(e)
  }
}
