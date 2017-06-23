/* global cozy */
import { combineReducers } from 'redux'

import UploadQueue from './UploadQueue'

export { UploadQueue }

const SLUG = 'upload'

export const ADD_TO_UPLOAD_QUEUE = 'ADD_TO_UPLOAD_QUEUE'
const UPLOAD_FILE = 'UPLOAD_FILE'
const RECEIVE_UPLOAD_SUCCESS = 'RECEIVE_UPLOAD_SUCCESS'
const RECEIVE_UPLOAD_ERROR = 'RECEIVE_UPLOAD_ERROR'
const PURGE_UPLOAD_QUEUE = 'PURGE_UPLOAD_QUEUE'

const PENDING = 'pending'
const LOADING = 'loading'
const LOADED = 'loaded'
const FAILED = 'failed'
const CONFLICT = 'conflict'
const QUOTA = 'quota'

const itemInitialState = file => ({
  file,
  status: PENDING
})

const status = action => {
  switch (action.type) {
    case UPLOAD_FILE:
      return LOADING
    case RECEIVE_UPLOAD_SUCCESS:
      return LOADED
    case RECEIVE_UPLOAD_ERROR:
      return action.status
  }
}

const item = (state, action) => Object.assign({}, state, { status: status(action) })

const queue = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_UPLOAD_QUEUE:
      return [
        ...state,
        ...action.files.map(f => itemInitialState(f))
      ]
    case PURGE_UPLOAD_QUEUE:
      return []
    case UPLOAD_FILE:
    case RECEIVE_UPLOAD_SUCCESS:
    case RECEIVE_UPLOAD_ERROR:
      return state.map(i => i.file.name !== action.file.name ? i : item(i, action))
    default:
      return state
  }
}
export default combineReducers({ queue })

const extractFileAttributes = f => Object.assign({}, f, f.attributes)

const processNextFile = (fileUploadedCallback, queueCompletedCallback, dirID) => async (dispatch, getState) => {
  const item = getUploadQueue(getState()).find(i => i.status === PENDING)
  if (!item) {
    return dispatch(onQueueEmpty(queueCompletedCallback))
  }
  const file = item.file
  try {
    dispatch({ type: UPLOAD_FILE, file })
    const uploadedFile = await cozy.client.files.create(file, { dirID })
    dispatch({ type: RECEIVE_UPLOAD_SUCCESS, file })
    // TODO: is the extractFileAttributes call really necessary?
    dispatch(fileUploadedCallback(extractFileAttributes(uploadedFile)))
  } catch (error) {
    let status

    if (error.status === 400) status = CONFLICT
    else if (error.status === 413) status = QUOTA
    else status = FAILED

    dispatch({ type: RECEIVE_UPLOAD_ERROR, file, status })
  }
  dispatch(processNextFile(fileUploadedCallback, queueCompletedCallback, dirID))
}

export const addToUploadQueue = (files, dirID, fileUploadedCallback, queueCompletedCallback) => async dispatch => {
  dispatch({ type: ADD_TO_UPLOAD_QUEUE, files })
  dispatch(processNextFile(fileUploadedCallback, queueCompletedCallback, dirID))
}

export const onQueueEmpty = (callback) => (dispatch, getState) => {

  const queue = getUploadQueue(getState())
  const loaded = getLoaded(queue)
  const quotas = getQuotaErrors(queue)
  const conflicts = getConflicts(queue)
  const errors = getErrors(queue)

  dispatch({ type: PURGE_UPLOAD_QUEUE })
  return dispatch(callback(loaded, quotas, conflicts, errors))
}

// selectors
const filterByStatus = (queue, status) => queue.filter(f => f.status === status)
const getConflicts = queue => filterByStatus(queue, CONFLICT)
const getErrors = queue => filterByStatus(queue, FAILED)
const getQuotaErrors = queue => filterByStatus(queue, QUOTA)
const getLoaded = queue => filterByStatus(queue, LOADED)

export const getUploadQueue = state => state[SLUG].queue
export const getProcessed = state => getUploadQueue(state).filter(f => f.status !== PENDING)
