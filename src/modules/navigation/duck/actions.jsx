import React from 'react'
import { showModal } from 'react-cozy-helpers'

import { isDirectory } from 'cozy-client/dist/models/file'

import { MAX_PAYLOAD_SIZE_IN_GB } from 'constants/config'
import { createEncryptedDir } from 'lib/encryption'
import { getEntriesTypeTranslated } from 'lib/entries'
import logger from 'lib/logger'
import { logException } from 'lib/reporter'
import { getFolderContent } from 'modules/selectors'
import { addToUploadQueue } from 'modules/upload'
import QuotaAlert from 'modules/upload/QuotaAlert'

export const SORT_FOLDER = 'SORT_FOLDER'

const HTTP_CODE_CONFLICT = 409

export const sortFolder = (folderId, sortAttribute, sortOrder = 'asc') => {
  return {
    type: SORT_FOLDER,
    folderId,
    sortAttribute,
    sortOrder
  }
}

/**
 * Upload files to the given directory
 * @param {Array} files - The list of File objects to upload
 * @param {string} dirId - The id of the directory in which we upload the files
 * @param {Object} sharingState - The sharing context (provided by SharingContext.Provider)
 * @param {function} fileUploadedCallback - A callback called when a file is uploaded
 * @returns {function} - A function that dispatches addToUploadQueue action
 */
export const uploadFiles =
  (
    files,
    dirId,
    sharingState,
    fileUploadedCallback = () => null,
    { client, vaultClient, showAlert, t }
  ) =>
  dispatch => {
    dispatch(
      addToUploadQueue(
        files,
        dirId,
        sharingState, // used to know if files are shared for conflicts management
        fileUploadedCallback,
        (
          loaded,
          quotas,
          conflicts,
          networkErrors,
          errors,
          updated,
          fileTooLargeErrors
        ) =>
          dispatch(
            uploadQueueProcessed(
              loaded,
              quotas,
              conflicts,
              networkErrors,
              errors,
              updated,
              showAlert,
              t,
              fileTooLargeErrors
            )
          ),
        { client, vaultClient }
      )
    )
  }

const uploadQueueProcessed =
  (
    created,
    quotas,
    conflicts,
    networkErrors,
    errors,
    updated,
    showAlert,
    t,
    fileTooLargeErrors
  ) =>
  dispatch => {
    const conflictCount = conflicts.length
    const createdCount = created.length
    const updatedCount = updated.length
    const type = getEntriesTypeTranslated(t, [
      ...created,
      ...updated,
      ...conflicts
    ])

    if (quotas.length > 0) {
      logger.warn(`Upload module triggers a quota alert: ${quotas}`)
      // quota errors have their own modal instead of a notification
      dispatch(showModal(<QuotaAlert />))
    } else if (networkErrors.length > 0) {
      logger.warn(`Upload module triggers a network error: ${networkErrors}`)
      showAlert({
        message: t('upload.alert.network'),
        severity: 'secondary'
      })
    } else if (errors.length > 0) {
      logException(`Upload module triggers an error: ${errors}`)
      showAlert({
        message: t('upload.alert.errors', {
          type
        }),
        severity: 'secondary'
      })
    } else if (updatedCount > 0 && createdCount > 0 && conflictCount > 0) {
      showAlert({
        message: t('upload.alert.success_updated_conflicts', {
          smart_count: createdCount,
          updatedCount,
          conflictCount,
          type
        }),
        severity: 'success'
      })
    } else if (updatedCount > 0 && createdCount > 0) {
      showAlert({
        message: t('upload.alert.success_updated', {
          smart_count: createdCount,
          updatedCount,
          type
        }),
        severity: 'success'
      })
    } else if (updatedCount > 0 && conflictCount > 0) {
      showAlert({
        message: t('upload.alert.updated_conflicts', {
          smart_count: updatedCount,
          conflictCount,
          type
        }),
        severity: 'success'
      })
    } else if (conflictCount > 0) {
      showAlert({
        message: t('upload.alert.success_conflicts', {
          smart_count: createdCount,
          conflictNumber: conflictCount,
          type
        }),
        severity: 'secondary'
      })
    } else if (updatedCount > 0 && createdCount === 0) {
      showAlert({
        message: t('upload.alert.updated', {
          smart_count: updatedCount,
          type
        }),
        severity: 'success'
      })
    } else if (fileTooLargeErrors.length > 0) {
      showAlert({
        message: t('upload.alert.fileTooLargeErrors', {
          max_size_value: MAX_PAYLOAD_SIZE_IN_GB
        }),
        severity: 'error'
      })
    } else {
      showAlert({
        message: t('upload.alert.success', {
          smart_count: createdCount,
          type
        }),
        severity: 'success'
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
export const createFolder = (
  client,
  vaultClient,
  name,
  currentFolderId,
  { isEncryptedFolder = false, showAlert, t } = {}
) => {
  return async (dispatch, getState) => {
    const state = getState()

    const existingFolder = doesFolderExistByName(state, currentFolderId, name)

    if (existingFolder) {
      showAlert({
        message: t('alert.folder_name', { folderName: name }),
        severity: 'error'
      })
      throw new Error('alert.folder_name')
    }

    try {
      if (!isEncryptedFolder) {
        await client.create('io.cozy.files', {
          name: name,
          dirId: currentFolderId,
          type: 'directory'
        })
      } else {
        await createEncryptedDir(client, vaultClient, {
          name,
          dirID: currentFolderId
        })
      }
    } catch (err) {
      if (err.response && err.response.status === HTTP_CODE_CONFLICT) {
        showAlert({
          message: t('alert.folder_name', { folderName: name }),
          severity: 'error'
        })
      } else {
        showAlert({ message: t('alert.folder_generic'), severity: 'error' })
      }
      throw err
    }
  }
}
