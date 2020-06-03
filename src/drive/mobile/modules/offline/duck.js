/* global cozy */
import {
  saveFileWithCordova,
  openOfflineFile,
  deleteOfflineFile,
  createTemporaryLocalFile,
  openFileWithCordova
} from 'drive/mobile/lib/filesystem'
import { isMobileApp } from 'cozy-device-helper'

import Alerter from 'cozy-ui/transpiled/react/Alerter'
import logger from 'lib/logger'
const MAKE_AVAILABLE_OFFLINE = 'MAKE_AVAILABLE_OFFLINE'
const UNDO_MAKE_AVAILABLE_OFFLINE = 'UNDO_MAKE_AVAILABLE_OFFLINE'

export default (state = [], action = {}) => {
  switch (action.type) {
    case MAKE_AVAILABLE_OFFLINE:
      return [...state, action.id]
    case UNDO_MAKE_AVAILABLE_OFFLINE: {
      const index = state.indexOf(action.id)
      return [...state.slice(0, index), ...state.slice(index + 1)]
    }
    default:
      return state
  }
}

const markAsAvailableOffline = id => ({ type: MAKE_AVAILABLE_OFFLINE, id })
const markAsUnavailableOffline = id => ({
  type: UNDO_MAKE_AVAILABLE_OFFLINE,
  id
})

export const getAvailableOfflineIds = ({ availableOffline }) => availableOffline

export const isAvailableOffline = ({ availableOffline: state }, id) =>
  Array.isArray(state) && state.indexOf(id) !== -1

export const toggleAvailableOffline = file => async (dispatch, getState) =>
  isAvailableOffline(getState(), file.id)
    ? dispatch(forgetDownloadedFile(file))
    : dispatch(makeAvailableOffline(file))

const forgetDownloadedFile = file => async dispatch => {
  const filename = file.id
  if (isMobileApp() && window.cordova.file) {
    deleteOfflineFile(filename)
  }
  dispatch(markAsUnavailableOffline(file.id))
}

const makeAvailableOffline = file => async dispatch => {
  await saveOfflineFileCopy(file)
  dispatch(markAsAvailableOffline(file.id))
}

const saveOfflineFileCopy = async file => {
  if (!isMobileApp() || !window.cordova.file) {
    return
  }
  const response = await cozy.client.files
    .downloadById(file.id)
    .catch(error => {
      Alerter.error('mobile.error.make_available_offline.offline')
      throw error
    })
  const blob = await response.blob()
  const filename = file.id
  saveFileWithCordova(blob, filename)
}

export const openLocalFile = file => async (dispatch, getState) => {
  if (!isAvailableOffline(getState(), file.id)) {
    logger.error('openLocalFile: this file is not available offline')
  }
  openOfflineFile(file).catch(error => {
    logger.error('openLocalFile', error)
    Alerter.error('mobile.error.make_available_offline.noapp')
  })
}

export const openLocalFileCopy = file => async (dispatch, getState) => {
  if (isAvailableOffline(getState(), file.id)) {
    return openOfflineFile(file)
  }
  const localFile = await createTemporaryLocalFile(file.id, file.name)
  return openFileWithCordova(localFile.nativeURL, file.mime)
}

export const updateOfflineFileCopyIfNecessary = (file, prevFile) => async (
  _,
  getState
) => {
  if (
    isAvailableOffline(getState(), file.id) &&
    file.md5sum !== prevFile.md5sum
  ) {
    await saveOfflineFileCopy(file)
  }
}
