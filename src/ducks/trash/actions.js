/* global cozy */

export const EMPTY_TRASH = 'EMPTY_TRASH'
export const EMPTY_TRASH_SUCCESS = 'EMPTY_TRASH_SUCCESS'
export const EMPTY_TRASH_FAILURE = 'EMPTY_TRASH_FAILURE'

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
