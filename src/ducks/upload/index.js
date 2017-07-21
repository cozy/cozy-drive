import { combineReducers } from 'redux'

import Alerter from '../../components/Alerter'

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

const processNextFile = (callback) => async (dispatch, getState) => {
  const item = getUploadQueue(getState()).find(i => i.status === PENDING)
  if (!item) {
    return dispatch(onQueueEmpty())
  }
  const file = item.file
  try {
    dispatch({ type: UPLOAD_FILE, file })
    await dispatch(callback(file))
    dispatch({ type: RECEIVE_UPLOAD_SUCCESS, file })
  } catch (error) {
    console.log(error)
    dispatch({ type: RECEIVE_UPLOAD_ERROR, file, status: error.status === 409 ? CONFLICT : FAILED })
  }
  dispatch(processNextFile(callback))
}

export const addToUploadQueue = (files, callback) => async dispatch => {
  dispatch({ type: ADD_TO_UPLOAD_QUEUE, files })
  dispatch(processNextFile(callback))
}

export const purgeUploadQueue = () => ({ type: PURGE_UPLOAD_QUEUE })

export const onQueueEmpty = () => (dispatch, getState) => {
  const queue = getUploadQueue(getState())
  const conflicts = getConflicts(queue)
  const errors = getErrors(queue)
  const loaded = getLoaded(queue)

  if (!conflicts.length && !errors.length) {
    Alerter.success(
      'UploadQueue.alert.success',
      {smart_count: loaded.length}
    )
  } else if (conflicts.length && !errors.length) {
    Alerter.info(
      'UploadQueue.alert.success_conflicts',
      {smart_count: loaded.length, conflictNumber: conflicts.length}
    )
  } else {
    Alerter.error('UploadQueue.alert.errors')
  }
}

// selectors
const filterByStatus = (queue, status) => queue.filter(f => f.status === status)
const getConflicts = queue => filterByStatus(queue, CONFLICT)
const getErrors = queue => filterByStatus(queue, FAILED)
const getLoaded = queue => filterByStatus(queue, LOADED)

export const getUploadQueue = state => state[SLUG].queue
export const getProcessed = state => getUploadQueue(state).filter(f => f.status !== PENDING)
export const getSuccessful = state => getLoaded(getUploadQueue(state))
