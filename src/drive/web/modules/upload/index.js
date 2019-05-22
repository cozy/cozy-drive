import { combineReducers } from 'redux'
import logger from 'lib/logger'

import flag from 'cozy-flags'

import { hasSharedParent, isShared } from 'sharing/state'
import UploadQueue from './UploadQueue'

export { UploadQueue }

const SLUG = 'upload'

export const ADD_TO_UPLOAD_QUEUE = 'ADD_TO_UPLOAD_QUEUE'
const UPLOAD_FILE = 'UPLOAD_FILE'
const RECEIVE_UPLOAD_SUCCESS = 'RECEIVE_UPLOAD_SUCCESS'
const RECEIVE_UPLOAD_ERROR = 'RECEIVE_UPLOAD_ERROR'
const PURGE_UPLOAD_QUEUE = 'PURGE_UPLOAD_QUEUE'

const CANCEL = 'cancel'
const PENDING = 'pending'
const LOADING = 'loading'
const CREATED = 'created'
const UPDATED = 'updated'
const FAILED = 'failed'
const CONFLICT = 'conflict'
const QUOTA = 'quota'
const NETWORK = 'network'
const DONE_STATUSES = [CREATED, UPDATED]
const ERROR_STATUSES = [CONFLICT, NETWORK, QUOTA]

export const status = {
  CANCEL,
  PENDING,
  LOADING,
  CREATED,
  UPDATED,
  FAILED,
  CONFLICT,
  QUOTA,
  NETWORK,
  DONE_STATUSES,
  ERROR_STATUSES
}

const CONFLICT_ERROR = 409

const itemInitialState = item => ({
  ...item,
  status: PENDING
})

const getStatus = action => {
  switch (action.type) {
    case UPLOAD_FILE:
      return LOADING
    case RECEIVE_UPLOAD_SUCCESS:
      return action.isUpdate ? UPDATED : CREATED
    case RECEIVE_UPLOAD_ERROR:
      return action.status
  }
}

const item = (state, action = { isUpdate: false }) => ({
  ...state,
  status: getStatus(action)
})

export const queue = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_UPLOAD_QUEUE:
      return [
        ...state.filter(i => i.status !== CREATED),
        ...action.files.map(f => itemInitialState(f))
      ]
    case PURGE_UPLOAD_QUEUE:
      return []
    case UPLOAD_FILE:
    case RECEIVE_UPLOAD_SUCCESS:
    case RECEIVE_UPLOAD_ERROR:
      return state.map(
        i => (i.file.name !== action.file.name ? i : item(i, action))
      )
    default:
      return state
  }
}

export default combineReducers({ queue })

export const processNextFile = (
  fileUploadedCallback,
  queueCompletedCallback,
  dirID,
  sharingState
) => async (dispatch, getState, { client }) => {
  let error = null
  if (!client) {
    throw new Error(
      'Upload module needs a cozy-client instance to work. This instance should be made available by using the extraArgument function of redux-thunk'
    )
  }
  const item = getUploadQueue(getState()).find(i => i.status === PENDING)
  if (!item) {
    return dispatch(onQueueEmpty(queueCompletedCallback))
  }
  const { file, entry, isDirectory } = item
  try {
    dispatch({ type: UPLOAD_FILE, file })
    if (entry && isDirectory) {
      const newDir = await uploadDirectory(client, entry, dirID)
      fileUploadedCallback(newDir)
    } else {
      const uploadedFile = await uploadFile(client, file, dirID)
      fileUploadedCallback(uploadedFile)
    }
    dispatch({ type: RECEIVE_UPLOAD_SUCCESS, file })
  } catch (uploadError) {
    if (uploadError.status === CONFLICT_ERROR) {
      try {
        error = uploadError
        const path = await getFileFullpath(client, file, dirID)
        if (
          flag('handle-conflicts') &&
          !isShared(sharingState, { path }) &&
          !hasSharedParent(sharingState, { path })
        ) {
          const uploadedFile = await overwriteFile(client, file, path)
          fileUploadedCallback(uploadedFile)
          dispatch({ type: RECEIVE_UPLOAD_SUCCESS, file, isUpdate: true })
          error = null
        }
      } catch (updateError) {
        error = updateError
      }
    }

    if (error) {
      logger.warn(error)
      const statusError = {
        409: CONFLICT,
        413: QUOTA
      }

      const status =
        statusError[error.status] ||
        (/Failed to fetch$/.exec(error.toString()) && NETWORK) ||
        FAILED

      dispatch({ type: RECEIVE_UPLOAD_ERROR, file, status })
    }
  }
  dispatch(
    processNextFile(
      fileUploadedCallback,
      queueCompletedCallback,
      dirID,
      sharingState
    )
  )
}

const getFileFromEntry = entry => new Promise(resolve => entry.file(resolve))

const uploadDirectory = async (client, directory, dirID) => {
  const newDir = await createFolder(client, directory.name, dirID)
  const dirReader = directory.createReader()
  return new Promise(resolve => {
    const entriesReader = async entries => {
      for (let i = 0; i < entries.length; i += 1) {
        const entry = entries[i]
        if (entry.isFile) {
          await uploadFile(client, await getFileFromEntry(entry), newDir.id)
        } else if (entry.isDirectory) {
          await uploadDirectory(client, entry, newDir.id)
        }
      }
      resolve(newDir)
    }
    dirReader.readEntries(entriesReader)
  })
}

const createFolder = async (client, name, dirID) => {
  const resp = await client
    .collection('io.cozy.files')
    .createDirectory({ name, dirId: dirID })
  return resp.data
}

const uploadFile = async (client, file, dirID) => {
  const resp = await client
    .collection('io.cozy.files')
    .createFile(file, { dirId: dirID })
  return resp.data
}

/*
 * @function
 * @param {Object} client - A CozyClient instance
 * @param {Object} file - The uploaded javascript File object
 * @param {string} dirID - The id of the parent directory
 * @return {Object} - The full path of the file in the cozy
 */
export const getFileFullpath = async (client, file, dirID) => {
  const resp = await client.collection('io.cozy.files').get(dirID)
  const parentDirectory = resp.data
  return `${parentDirectory.path}/${file.name}`.replace('//', '/')
}

/*
 * @function
 * @param {Object} client - A CozyClient instance
 * @param {Object} file - The uploaded javascript File object
 * @param {string} path - The file's path in the cozy
 * @return {Object} - The updated io.cozy.files
 */
export const overwriteFile = async (client, file, path) => {
  const statResp = await client.collection('io.cozy.files').statByPath(path)
  const { id: fileId, dir_id: dirId } = statResp.data
  const resp = await client
    .collection('io.cozy.files')
    .updateFile(file, { dirId, fileId })

  return resp.data
}

export const addToUploadQueue = (
  files,
  dirID,
  sharingState,
  fileUploadedCallback,
  queueCompletedCallback
) => async dispatch => {
  dispatch({
    type: ADD_TO_UPLOAD_QUEUE,
    files: extractFilesEntries(files)
  })
  dispatch(
    processNextFile(
      fileUploadedCallback,
      queueCompletedCallback,
      dirID,
      sharingState
    )
  )
}

export const purgeUploadQueue = () => ({ type: PURGE_UPLOAD_QUEUE })

export const onQueueEmpty = callback => (dispatch, getState) => {
  const queue = getUploadQueue(getState())
  const quotas = getQuotaErrors(queue)
  const conflicts = getConflicts(queue)
  const created = getCreated(queue)
  const updated = getUpdated(queue)
  const networkErrors = getNetworkErrors(queue)
  const errors = getErrors(queue)

  return callback(created, quotas, conflicts, networkErrors, errors, updated)
}

// selectors
const filterByStatus = (queue, status) => queue.filter(f => f.status === status)
const getConflicts = queue => filterByStatus(queue, CONFLICT)
const getErrors = queue => filterByStatus(queue, FAILED)
const getQuotaErrors = queue => filterByStatus(queue, QUOTA)
const getNetworkErrors = queue => filterByStatus(queue, NETWORK)
const getCreated = queue => filterByStatus(queue, CREATED)
const getUpdated = queue => filterByStatus(queue, UPDATED)

export const getUploadQueue = state => state[SLUG].queue

export const getProcessed = state =>
  getUploadQueue(state).filter(f => f.status !== PENDING)

export const getSuccessful = state => {
  const queue = getUploadQueue(state)
  return queue.filter(f => [CREATED, UPDATED].includes(f.status))
}

export const selectors = {
  getConflicts,
  getErrors,
  getQuotaErrors,
  getNetworkErrors,
  getCreated,
  getUpdated,
  getProcessed,
  getSuccessful
}

// DOM helpers
const extractFilesEntries = items => {
  let results = []
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]
    if (item.webkitGetAsEntry != null && item.webkitGetAsEntry()) {
      const entry = item.webkitGetAsEntry()
      results.push({
        file: item.getAsFile(),
        isDirectory: entry.isDirectory === true,
        entry
      })
    } else {
      results.push({ file: item, isDirectory: false, entry: null })
    }
  }
  return results
}
