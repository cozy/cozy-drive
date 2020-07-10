/* global cozy */
import React from 'react'

import { isDirectory } from 'drive/web/modules/drive/files'
import { addToUploadQueue } from 'drive/web/modules/upload'
import { showModal } from 'react-cozy-helpers'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import QuotaAlert from 'drive/web/modules/upload/QuotaAlert'
import {
  getCurrentFolderId,
  getFolderContent
} from 'drive/web/modules/selectors'

export const SORT_FOLDER_V2 = 'SORT_FOLDER_V2'

const HTTP_CODE_CONFLICT = 409

export const sortFolderV2 = (folderId, sortAttribute, sortOrder = 'asc') => {
  return {
    type: SORT_FOLDER_V2,
    folderId,
    sortAttribute,
    sortOrder
  }
}

export const getFileDownloadUrl = async id => {
  const link = await cozy.client.files.getDownloadLinkById(id)
  return `${cozy.client._url}${link}`
}

/*
 * @function
 * @param {Array} files - The list of File objects to upload
 * @param {string} dirId - The id of the directory in which we upload the files
 * @param {Object} sharingState - The sharing context (provided by SharingContext.Provider)
 * @param {function} fileUploadedCallback - Optional function to call when the upload is completed
 * @returns {function} - A function that dispatches addToUploadQueue action
 */
export const uploadFiles = (
  files,
  dirId,
  sharingState,
  fileUploadedCallback = () => null
) => dispatch => {
  dispatch(
    addToUploadQueue(
      files,
      dirId,
      sharingState, // used to know if files are shared for conflicts management
      fileUploadedCallback,
      (loaded, quotas, conflicts, networkErrors, errors, updated) =>
        dispatch(
          uploadQueueProcessed(
            loaded,
            quotas,
            conflicts,
            networkErrors,
            errors,
            updated
          )
        )
    )
  )
}

const uploadQueueProcessed = (
  created,
  quotas,
  conflicts,
  networkErrors,
  errors,
  updated
) => dispatch => {
  const conflictCount = conflicts.length
  const createdCount = created.length
  const updatedCount = updated.length
  if (quotas.length > 0) {
    // quota errors have their own modal instead of a notification
    dispatch(showModal(<QuotaAlert />))
  } else if (networkErrors.length > 0) {
    Alerter.info('upload.alert.network')
  } else if (errors.length > 0) {
    Alerter.info('upload.alert.errors')
  } else if (updatedCount > 0 && createdCount > 0 && conflictCount > 0) {
    Alerter.success('upload.alert.success_updated_conflicts', {
      smart_count: createdCount,
      updatedCount,
      conflictCount
    })
  } else if (updatedCount > 0 && createdCount > 0) {
    Alerter.success('upload.alert.success_updated', {
      smart_count: createdCount,
      updatedCount
    })
  } else if (updatedCount > 0 && conflictCount > 0) {
    Alerter.success('upload.alert.updated_conflicts', {
      smart_count: updatedCount,
      conflictCount
    })
  } else if (conflictCount > 0) {
    Alerter.info('upload.alert.success_conflicts', {
      smart_count: createdCount,
      conflictNumber: conflictCount
    })
  } else if (updatedCount > 0 && createdCount === 0) {
    Alerter.success('upload.alert.updated', {
      smart_count: updatedCount
    })
  } else {
    Alerter.success('upload.alert.success', {
      smart_count: createdCount
    })
  }
}

/**
 * Given a folderId, checks the current known state to return if
 * a folder with the same name exist in the given folderId.
 *
 * The local state can be incomplete so this can return false
 * negatives.
 */
const doesFolderExistByName = (state, parentFolderId, name) => {
  const filesInCurrentView = getFolderContent(state, parentFolderId) || [] // TODO in the public view we don't use a query, so getFolderContent returns null. We could look inside the cozy-client store with a predicate to find folders with a matching dir_id.

  const existingFolder = filesInCurrentView.find(f => {
    return isDirectory(f) && f.name === name
  })

  return Boolean(existingFolder)
}

/**
 * Creates a folder in the current view
 */
export const createFolderV2 = (client, name) => {
  return async (dispatch, getState) => {
    const state = getState()
    const currentFolderId = getCurrentFolderId(state)
    const existingFolder = doesFolderExistByName(state, currentFolderId, name)

    if (existingFolder) {
      Alerter.error('alert.folder_name', { folderName: name })
      throw new Error('alert.folder_name')
    }

    try {
      await client.create('io.cozy.files', {
        name: name,
        dirId: currentFolderId,
        type: 'directory'
      })
    } catch (err) {
      if (err.response && err.response.status === HTTP_CODE_CONFLICT) {
        Alerter.error('alert.folder_name', { folderName: name })
      } else {
        Alerter.error('alert.folder_generic')
      }
      throw err
    }
  }
}
