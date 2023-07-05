import localforage from 'localforage'

import {
  saveFileWithCordova,
  openOfflineFile,
  deleteOfflineFile
} from 'cozy-client/dist/models/fsnative'
import { isMobileApp } from 'cozy-device-helper'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import {
  getEncryptionKeyFromDirId,
  decryptFile,
  isEncryptedFile
} from 'drive/lib/encryption'
import { openFileWith } from 'drive/web/modules/actions/utils'
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
export const markAsUnavailableOffline = id => ({
  type: UNDO_MAKE_AVAILABLE_OFFLINE,
  id
})

export const getAvailableOfflineIds = ({ availableOffline }) => availableOffline

export const isAvailableOffline = ({ availableOffline: state }, id) =>
  Array.isArray(state) && state.indexOf(id) !== -1

export const toggleAvailableOffline =
  (file, client, { vaultClient }) =>
  async (dispatch, getState) =>
    isAvailableOffline(getState(), file.id)
      ? dispatch(forgetDownloadedFile(file))
      : dispatch(makeAvailableOffline(file, client, { vaultClient }))

const forgetDownloadedFile = file => async dispatch => {
  const filename = file.id
  if (isMobileApp() && window.cordova.file) {
    deleteOfflineFile(filename)
  }
  dispatch(markAsUnavailableOffline(file.id))
}

const makeAvailableOffline =
  (file, client, { vaultClient }) =>
  async dispatch => {
    await saveOfflineFileCopy(file, client, { vaultClient })
    dispatch(markAsAvailableOffline(file.id))
  }

export const saveOfflineFileCopy = async (file, client, { vaultClient }) => {
  if (!isMobileApp() || !window.cordova.file) {
    return
  }
  try {
    let blob
    if (isEncryptedFile(file)) {
      const encryptionKey = await getEncryptionKeyFromDirId(client, file.dir_id)
      blob = await decryptFile(client, vaultClient, { file, encryptionKey })
    } else {
      const response = await client
        .collection(DOCTYPE_FILES)
        .fetchFileContentById(file.id)
      blob = await response.blob()
    }
    const filename = file.id
    saveFileWithCordova(blob, filename)
  } catch (error) {
    Alerter.error('mobile.error.make_available_offline.offline')
    throw error
  }
}

export const openLocalFile = (client, file) => async (dispatch, getState) => {
  if (!isAvailableOffline(getState(), file.id)) {
    logger.error('openLocalFile: this file is not available offline')
  }
  const originalMime = isEncryptedFile(file)
    ? client.collection(DOCTYPE_FILES).getFileTypeFromName(file.name)
    : file.mime
  const fileWithMime = { ...file, mime: originalMime }

  openOfflineFile(fileWithMime).catch(error => {
    logger.error('openLocalFile', error)
    Alerter.error('mobile.error.make_available_offline.noapp')
  })
}

// TODO remove this one ? Only used in the No supportedViewer
export const openLocalFileCopy =
  (client, file, { vaultClient }) =>
  async (dispatch, getState) => {
    const originalMime = isEncryptedFile(file)
      ? client.collection(DOCTYPE_FILES).getFileTypeFromName(file.name)
      : file.mime
    const fileWithMime = { ...file, mime: originalMime }
    if (isAvailableOffline(getState(), file.id)) {
      return openOfflineFile(fileWithMime)
    }
    return openFileWith(client, file, { vaultClient })
  }

export const updateOfflineFileCopyIfNecessary =
  (file, prevFile, client) => async (_, getState) => {
    if (
      isAvailableOffline(getState(), file.id) &&
      file.md5sum !== prevFile.md5sum
    ) {
      await saveOfflineFileCopy(file, client)
    }
  }

export const addFileIdToLocalStorageItem = async (key, value) => {
  const oldValue = (await localforage.getItem(key)) || []
  await localforage.setItem(key, [...oldValue, value])
}
