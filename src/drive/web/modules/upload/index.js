import { combineReducers } from 'redux'

import { hasSharedParent, isShared } from 'sharing/state'
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
const NETWORK = 'network'

const CONFLICT_ERROR = 409

const itemInitialState = item => ({
  ...item,
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

const item = (state, action = { isUpdate: false }) =>
  Object.assign({}, state, {
    isUpdate: action.isUpdate,
    status: status(action)
  })

const queue = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_UPLOAD_QUEUE:
      return [
        ...state.filter(i => i.status !== LOADED),
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
        const path = await getFilePath(client, file, dirID)
        if (
          !isShared(sharingState, { path }) &&
          !hasSharedParent(sharingState, { path })
        ) {
          const uploadedFile = await overwriteFile(client, file, path, dirID)
          fileUploadedCallback(uploadedFile)
          dispatch({ type: RECEIVE_UPLOAD_SUCCESS, file, isUpdate: true })
          error = null
        }
      } catch (updateError) {
        error = updateError
      }
    }

    if (error) {
      // eslint-disable-next-line no-console
      console.warn(error)
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

export const getFilePath = async (client, file, dirID) => {
  const resp = await client.collection('io.cozy.files').get(dirID)
  const parentDirectory = resp.data
  return `${parentDirectory.path}/${file.name}`
}

export const overwriteFile = async (client, file, path, dirID) => {
  const statResp = await client.collection('io.cozy.files').statByPath(path)
  const fileId = statResp.data.id
  const resp = await client
    .collection('io.cozy.files')
    .updateFile(file, { dirId: dirID, fileId })

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
  const uploaded = getUploaded(queue)
  const quotas = getQuotaErrors(queue)
  const conflicts = getConflicts(queue)
  const updated = getUpdated(queue)
  const networkErrors = getNetworkErrors(queue)
  const errors = getErrors(queue)

  return callback(uploaded, quotas, conflicts, networkErrors, errors, updated)
}

// selectors
const filterByStatus = (queue, status) => queue.filter(f => f.status === status)
const getConflicts = queue => filterByStatus(queue, CONFLICT)
const getErrors = queue => filterByStatus(queue, FAILED)
const getQuotaErrors = queue => filterByStatus(queue, QUOTA)
const getNetworkErrors = queue => filterByStatus(queue, NETWORK)
const getLoaded = queue => filterByStatus(queue, LOADED)
const getUploaded = queue => getLoaded(queue).filter(f => !f.isUpdate)
const getUpdated = queue => getLoaded(queue).filter(f => f.isUpdate)

export const getUploadQueue = state => state[SLUG].queue
export const getProcessed = state =>
  getUploadQueue(state).filter(f => f.status !== PENDING)
export const getSuccessful = state => getLoaded(getUploadQueue(state))

export const selectors = {
  getConflicts,
  getErrors,
  getQuotaErrors,
  getNetworkErrors,
  getLoaded,
  getUploaded,
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
