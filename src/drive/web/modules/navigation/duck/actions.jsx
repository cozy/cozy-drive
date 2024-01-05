import React from 'react'

import { isDirectory } from 'cozy-client/dist/models/file'
import { showModal } from 'react-cozy-helpers'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import { addToUploadQueue } from 'drive/web/modules/upload'
import logger from 'lib/logger'
import QuotaAlert from 'drive/web/modules/upload/QuotaAlert'
import { getFolderContent } from 'drive/web/modules/selectors'
import { createEncryptedDir } from 'lib/encryption'
import { logException } from 'lib/reporter'
import { getEntriesTypeTranslated } from 'lib/entries'

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
    { client, vaultClient, t }
  ) =>
  dispatch => {
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
              updated,
              t
            )
          ),
        { client, vaultClient }
      )
    )
  }

const uploadQueueProcessed =
  (created, quotas, conflicts, networkErrors, errors, updated, t) =>
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
      Alerter.info('upload.alert.network')
    } else if (errors.length > 0) {
      logException(`Upload module triggers an error: ${errors}`)
      Alerter.info('upload.alert.errors', {
        type
      })
    } else if (updatedCount > 0 && createdCount > 0 && conflictCount > 0) {
      Alerter.success('upload.alert.success_updated_conflicts', {
        smart_count: createdCount,
        updatedCount,
        conflictCount,
        type
      })
    } else if (updatedCount > 0 && createdCount > 0) {
      Alerter.success('upload.alert.success_updated', {
        smart_count: createdCount,
        updatedCount,
        type
      })
    } else if (updatedCount > 0 && conflictCount > 0) {
      Alerter.success('upload.alert.updated_conflicts', {
        smart_count: updatedCount,
        conflictCount,
        type
      })
    } else if (conflictCount > 0) {
      Alerter.info('upload.alert.success_conflicts', {
        smart_count: createdCount,
        conflictNumber: conflictCount,
        type
      })
    } else if (updatedCount > 0 && createdCount === 0) {
      Alerter.success('upload.alert.updated', {
        smart_count: updatedCount,
        type
      })
    } else {
      Alerter.success('upload.alert.success', {
        smart_count: createdCount,
        type
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
  { isEncryptedFolder = false } = {}
) => {
  return async (dispatch, getState) => {
    const state = getState()

    const existingFolder = doesFolderExistByName(state, currentFolderId, name)

    if (existingFolder) {
      Alerter.error('alert.folder_name', { folderName: name })
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
        Alerter.error('alert.folder_name', { folderName: name })
      } else {
        Alerter.error('alert.folder_generic')
      }
      throw err
    }
  }
}
