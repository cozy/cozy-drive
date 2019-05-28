/* global cozy */
import Alerter from 'cozy-ui/react/Alerter'

export const EMPTY_TRASH = 'EMPTY_TRASH'
export const EMPTY_TRASH_SUCCESS = 'EMPTY_TRASH_SUCCESS'
export const EMPTY_TRASH_FAILURE = 'EMPTY_TRASH_FAILURE'
export const RESTORE_FILES = 'RESTORE_FILES'
export const RESTORE_FILES_SUCCESS = 'RESTORE_FILES_SUCCESS'
export const RESTORE_FILES_FAILURE = 'RESTORE_FILES_FAILURE'
export const DESTROY_FILES = 'DESTROY_FILES'
export const DESTROY_FILES_SUCCESS = 'DESTROY_FILES_SUCCESS'
export const DESTROY_FILES_FAILURE = 'DESTROY_FILES_FAILURE'
export const OPEN_FOLDER_FROM_TRASH = 'OPEN_FOLDER_FROM_TRASH'
export const OPEN_FOLDER_FROM_TRASH_SUCCESS = 'OPEN_FOLDER_FROM_TRASH_SUCCESS'
export const OPEN_FOLDER_FROM_TRASH_FAILURE = 'OPEN_FOLDER_FROM_TRASH_FAILURE'
export const emptyTrash = () => async dispatch => {
  Alerter.info('alert.empty_trash_progress')
  dispatch({
    type: EMPTY_TRASH
  })
  try {
    await cozy.client.files.clearTrash()
  } catch (err) {
    Alerter.error('alert.try_again')
    return dispatch({
      type: EMPTY_TRASH_FAILURE
    })
  }
  Alerter.info('alert.empty_trash_success')
  return dispatch({
    type: EMPTY_TRASH_SUCCESS
  })
}

const META_DEFAULTS = {
  cancelSelection: true,
  hideActionMenu: true
}

export const restoreFiles = files => async dispatch => {
  const meta = META_DEFAULTS
  dispatch({ type: RESTORE_FILES, files })
  const restored = []
  try {
    for (const file of files) {
      restored.push(await cozy.client.files.restoreById(file.id))
    }
  } catch (err) {
    Alerter.error('alert.try_again')
    return dispatch({
      type: RESTORE_FILES_FAILURE,
      meta
    })
  }
  Alerter.info('alert.restore_file_success')
  return dispatch({
    type: RESTORE_FILES_SUCCESS,
    ids: files.map(f => f.id),
    meta
  })
}

export const destroyFiles = files => async dispatch => {
  const meta = META_DEFAULTS
  dispatch({ type: DESTROY_FILES, files })
  const trashed = []
  try {
    for (const file of files) {
      trashed.push(await cozy.client.files.destroyById(file.id))
    }
  } catch (err) {
    Alerter.error('alert.try_again')
    return dispatch({
      type: DESTROY_FILES_FAILURE,
      meta
    })
  }
  Alerter.info('alert.destroy_file_success')
  return dispatch({
    type: DESTROY_FILES_SUCCESS,
    ids: files.map(f => f.id),
    meta
  })
}
