/* global cozy */

export const EMPTY_TRASH = 'EMPTY_TRASH'
export const EMPTY_TRASH_SUCCESS = 'EMPTY_TRASH_SUCCESS'
export const EMPTY_TRASH_FAILURE = 'EMPTY_TRASH_FAILURE'
export const RESTORE_FILES = 'RESTORE_FILES'
export const RESTORE_FILES_SUCCESS = 'RESTORE_FILES_SUCCESS'
export const RESTORE_FILES_FAILURE = 'RESTORE_FILES_FAILURE'
export const DESTROY_FILES = 'DESTROY_FILES'
export const DESTROY_FILES_SUCCESS = 'DESTROY_FILES_SUCCESS'
export const DESTROY_FILES_FAILURE = 'DESTROY_FILES_FAILURE'

export const emptyTrash = () => {
  return async dispatch => {
    dispatch({ type: EMPTY_TRASH })
    try {
      await cozy.client.files.clearTrash()
    } catch (err) {
      return dispatch({
        type: EMPTY_TRASH_FAILURE,
        alert: {
          message: 'alert.try_again'
        }
      })
    }
    return dispatch({
      type: EMPTY_TRASH_SUCCESS,
      alert: {
        message: 'alert.empty_trash_success'
      }
    })
  }
}

export const restoreFiles = files => {
  return async dispatch => {
    dispatch({ type: RESTORE_FILES, files })
    const restored = []
    try {
      for (const file of files) {
        restored.push(await cozy.client.files.restoreById(file.id))
      }
    } catch (err) {
      return dispatch({
        type: RESTORE_FILES_FAILURE,
        alert: {
          message: 'alert.try_again'
        }
      })
    }
    return dispatch({
      type: RESTORE_FILES_SUCCESS,
      ids: files.map(f => f.id),
      alert: {
        message: 'alert.restore_file_success'
      }
    })
  }
}

export const destroyFiles = files => {
  return async dispatch => {
    dispatch({ type: DESTROY_FILES, files })
    const trashed = []
    try {
      for (const file of files) {
        trashed.push(await cozy.client.files.destroyById(file.id))
      }
    } catch (err) {
      return dispatch({
        type: DESTROY_FILES_FAILURE,
        alert: {
          message: 'alert.try_again'
        }
      })
    }
    return dispatch({
      type: DESTROY_FILES_SUCCESS,
      ids: files.map(f => f.id),
      alert: {
        message: 'alert.destroy_file_success'
      }
    })
  }
}
