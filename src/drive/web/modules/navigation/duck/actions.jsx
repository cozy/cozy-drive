/* global cozy */
import { getAdapter, extractFileAttributes } from './async'
import { getSort } from './reducer'
import React from 'react'
import { isMobileApp } from 'cozy-device-helper'
import {
  saveFileWithCordova,
  saveAndOpenWithCordova
} from 'drive/mobile/lib/filesystem'
import { logException } from 'drive/lib/reporter'
import {
  isDirectory,
  isReferencedByAlbum,
  ALBUMS_DOCTYPE
} from 'drive/web/modules/drive/files'
import { addToUploadQueue } from 'drive/web/modules/upload'
import { showModal } from 'react-cozy-helpers'
import Alerter from 'cozy-ui/react/Alerter'
import QuotaAlert from 'drive/web/modules/upload/QuotaAlert'
import { getOpenedFolderId } from 'drive/web/modules/navigation/duck'

export const OPEN_FOLDER = 'OPEN_FOLDER'
export const OPEN_FOLDER_SUCCESS = 'OPEN_FOLDER_SUCCESS'
export const OPEN_FOLDER_FAILURE = 'OPEN_FOLDER_FAILURE'
export const SORT_FOLDER = 'SORT_FOLDER'
export const SORT_FOLDER_SUCCESS = 'SORT_FOLDER_SUCCESS'
export const SORT_FOLDER_FAILURE = 'SORT_FOLDER_FAILURE'
export const FETCH_RECENT = 'FETCH_RECENT'
export const FETCH_RECENT_SUCCESS = 'FETCH_RECENT_SUCCESS'
export const FETCH_RECENT_FAILURE = 'FETCH_RECENT_FAILURE'
export const FETCH_SHARINGS = 'FETCH_SHARINGS'
export const FETCH_SHARINGS_SUCCESS = 'FETCH_SHARINGS_SUCCESS'
export const FETCH_SHARINGS_FAILURE = 'FETCH_SHARINGS_FAILURE'
export const FETCH_MORE_FILES = 'FETCH_MORE_FILES'
export const FETCH_MORE_FILES_SUCCESS = 'FETCH_MORE_FILES_SUCCESS'
export const FETCH_MORE_FILES_FAILURE = 'FETCH_MORE_FILES_FAILURE'
export const CREATE_FOLDER = 'CREATE_FOLDER'
export const CREATE_FOLDER_FAILURE_GENERIC = 'CREATE_FOLDER_FAILURE_GENERIC'
export const CREATE_FOLDER_FAILURE_DUPLICATE = 'CREATE_FOLDER_FAILURE_DUPLICATE'
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS'
export const TRASH_FILES = 'TRASH_FILES'
export const TRASH_FILES_SUCCESS = 'TRASH_FILES_SUCCESS'
export const TRASH_FILES_FAILURE = 'TRASH_FILES_FAILURE'
export const DOWNLOAD_SELECTION = 'DOWNLOAD_SELECTION'
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE'
export const OPEN_FILE_WITH = 'OPEN_FILE_WITH'
export const ADD_FILE = 'ADD_FILE'
export const UPDATE_FILE = 'UPDATE_FILE'
export const DELETE_FILE = 'DELETE_FILE'

const HTTP_CODE_CONFLICT = 409

export const META_DEFAULTS = {
  cancelSelection: true,
  hideActionMenu: true
}

export const openFolder = (
  folderId,
  openFolderAction = OPEN_FOLDER,
  openFolderActionSucess = OPEN_FOLDER_SUCCESS,
  openFolderActionFailure = OPEN_FOLDER_FAILURE
) => {
  return async (dispatch, getState) => {
    dispatch({
      type: openFolderAction,
      folderId,
      meta: {
        cancelSelection: true
      }
    })
    try {
      // PB: Pouch Mango queries don't return the total count...
      // and so the fetchMore button would not be displayed unless... see FileList
      const folder = await getAdapter(getState()).getFolder(folderId)
      /*
        Since getFolder is async, if we have a very bad network we can receive multiple response 
        if the user clicks multiple times. We are not sure about the order of the response. 
        So before dispatching the success, we check if the folder is still the one we want to open 
        and display. To do that, we get the folder id from the latest OPEN_FOLDER call
      */
      const currentFolderId = getOpenedFolderId(getState())
      if (folder._id === currentFolderId) {
        return dispatch({
          type: openFolderActionSucess,
          folder,
          fileCount: folder.contents.meta.count || 0,
          files: folder.contents.data
        })
      }

      return
    } catch (err) {
      logException(err, {
        context: openFolderActionFailure
      })
      return dispatch({ type: openFolderActionFailure, error: err })
    }
  }
}

export const sortFolder = (folderId, sortAttribute, sortOrder = 'asc') => {
  return async (dispatch, getState) => {
    dispatch({
      type: SORT_FOLDER,
      folderId,
      sortAttribute,
      sortOrder,
      meta: {
        cancelSelection: true
      }
    })
    try {
      const files = await getAdapter(getState()).getSortedFolder(
        folderId,
        sortAttribute,
        sortOrder
      )
      return dispatch({
        type: SORT_FOLDER_SUCCESS,
        files
      })
    } catch (err) {
      logException(err, {
        context: SORT_FOLDER_FAILURE
      })
      return dispatch({ type: SORT_FOLDER_FAILURE, error: err })
    }
  }
}

export const fetchMoreFiles = (folderId, skip, limit) => {
  return async (dispatch, getState) => {
    const sort = getSort(getState())
    dispatch({ type: FETCH_MORE_FILES, folderId, skip, limit })
    try {
      const files =
        sort === null
          ? await getAdapter(getState()).getFolderContents(
              folderId,
              skip,
              limit
            )
          : await getAdapter(getState()).getSortedFolder(
              folderId,
              sort.attribute,
              sort.order,
              skip,
              limit
            )
      return dispatch({
        type: FETCH_MORE_FILES_SUCCESS,
        files,
        skip,
        limit
      })
    } catch (err) {
      logException(err, {
        context: FETCH_MORE_FILES_FAILURE
      })
      return dispatch({ type: FETCH_MORE_FILES_FAILURE, error: err })
    }
  }
}

export const fetchRecentFiles = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_RECENT,
      meta: META_DEFAULTS
    })

    try {
      const files = await getAdapter(getState()).getRecentFiles()
      // fetch the list of parent dirs to get the path of recent files
      const parentDirIds = files
        .map(f => f.dir_id)
        .filter((value, index, self) => self.indexOf(value) === index)

      const parentFolders = await getAdapter(getState()).getFilesInBatch(
        parentDirIds
      )

      const filesWithPath = files.map(file => {
        const parentFolder = parentFolders.rows.find(
          row => row.id === file.dir_id
        )
        const path = parentFolder ? parentFolder.doc.path : ''
        return { ...file, path, id: file._id }
      })
      return dispatch({
        type: FETCH_RECENT_SUCCESS,
        fileCount: filesWithPath.length,
        files: filesWithPath
      })
    } catch (err) {
      logException(err, {
        context: FETCH_RECENT_FAILURE
      })
      return dispatch({ type: FETCH_RECENT_FAILURE, error: err })
    }
  }
}

export const addFile = doc => {
  return (dispatch, getState) =>
    dispatch({
      type: ADD_FILE,
      file: doc,
      currentFileCount: getState().view.fileCount,
      currentSort: getSort(getState())
    })
}

export const updateFile = doc => ({
  type: UPDATE_FILE,
  file: doc
})

export const deleteFile = doc => ({
  type: DELETE_FILE,
  file: doc
})

export const getFileDownloadUrl = async id => {
  const link = await cozy.client.files.getDownloadLinkById(id)
  return `${cozy.client._url}${link}`
}

/*
 * @function
 * @param {Array} files - The list of File objects to upload
 * @param {string} dirId - The id of the directory in which we upload the files
 * @param {Object} sharingState - The sharing context (provided by SharingContext.Provider)
 * @returns {function} - A function that dispatches addToUploadQueue action
 */
export const uploadFiles = (files, dirId, sharingState) => dispatch => {
  dispatch(
    addToUploadQueue(
      files,
      dirId,
      sharingState, // used to know if files are shared for conflicts management
      () => null,
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

export const createFolder = name => {
  return async (dispatch, getState) => {
    const existingFolder = getState().view.files.folder.find(
      f => isDirectory(f) && f.name === name
    )
    const currentFileCount = getState().view.fileCount
    if (existingFolder) {
      Alerter.error('alert.folder_name', { folderName: name })
      dispatch({
        type: CREATE_FOLDER_FAILURE_DUPLICATE,
        folderName: name
      })
      throw new Error('alert.folder_name')
    }

    dispatch({
      type: CREATE_FOLDER,
      name
    })

    try {
      const folder = await cozy.client.files.createDirectory({
        name: name,
        dirID: getState().view.displayedFolder.id
      })
      const sort = getSort(getState())
      dispatch({
        type: CREATE_FOLDER_SUCCESS,
        folder: extractFileAttributes(folder),
        currentFileCount,
        currentSort: sort
      })
    } catch (err) {
      if (err.response && err.response.status === HTTP_CODE_CONFLICT) {
        Alerter.error('alert.folder_name', { folderName: name })
        dispatch({
          type: CREATE_FOLDER_FAILURE_DUPLICATE,
          folderName: name
        })
      } else {
        Alerter.error('alert.folder_generic')
        dispatch({
          type: CREATE_FOLDER_FAILURE_GENERIC
        })
      }
      throw err
    }
  }
}

export const trashFiles = files => async (dispatch, _, { client }) => {
  dispatch({ type: TRASH_FILES, files, meta: META_DEFAULTS })
  const trashed = []
  try {
    for (const file of files) {
      trashed.push(await cozy.client.files.trashById(file.id))

      if (isReferencedByAlbum(file)) {
        for (const ref of file.relationships.referenced_by.data) {
          if (ref.type === ALBUMS_DOCTYPE) {
            await cozy.client.data.removeReferencedFiles(
              { _type: ref.type, _id: ref.id },
              file.id
            )
          }
        }
      }

      client.collection('io.cozy.permissions').revokeSharingLink(file)
    }
  } catch (err) {
    if (!isAlreadyInTrash(err)) {
      Alerter.error('alert.try_again')
      return dispatch({
        type: TRASH_FILES_FAILURE
      })
    }
  }
  Alerter.success('alert.trash_file_success')
  return dispatch({
    type: TRASH_FILES_SUCCESS,
    ids: files.map(f => f.id)
  })
}

const isAlreadyInTrash = err => {
  const reasons = err.reason !== undefined ? err.reason.errors : undefined
  if (reasons) {
    for (const reason of reasons) {
      if (reason.detail === 'File or directory is already in the trash') {
        return true
      }
    }
  }
  return false
}

const isMissingFile = error => error.status === 404

export const downloadFileError = error => {
  return isMissingFile(error)
    ? 'error.download_file.missing'
    : 'error.download_file.offline'
}

export const downloadFiles = files => {
  const meta = META_DEFAULTS
  return async dispatch => {
    if (files.length === 1 && !isDirectory(files[0])) {
      return dispatch(downloadFile(files[0], meta))
    }
    const paths = files.map(f => f.path)
    const href = await cozy.client.files.getArchiveLinkByPaths(paths)
    const fullpath = await cozy.client.fullpath(href)
    forceFileDownload(fullpath, 'files.zip')
    return dispatch({ type: DOWNLOAD_SELECTION, files, meta })
  }
}

const downloadFile = (file, meta) => {
  return async dispatch => {
    const downloadURL = await cozy.client.files
      .getDownloadLinkById(file.id)
      .catch(error => {
        Alerter.error(downloadFileError(error))
        throw error
      })
    const filename = file.name

    forceFileDownload(`${cozy.client._url}${downloadURL}?Dl=1`, filename)
    return dispatch({ type: DOWNLOAD_FILE, file, meta })
  }
}

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// MOBILE STUFF
export const exportFilesNative = files => {
  return async () => {
    const downloadAllFiles = files.map(async file => {
      const response = await cozy.client.files.downloadById(file.id)
      const blob = await response.blob()
      const filename = file.name
      const localFile = await saveFileWithCordova(blob, filename)
      return localFile.nativeURL
    })

    try {
      Alerter.info('alert.preparing', {
        duration: Math.min(downloadAllFiles.length * 2000, 6000)
      })
      const urls = await Promise.all(downloadAllFiles)
      window.plugins.socialsharing.shareWithOptions(
        {
          files: urls
        },
        null,
        error => {
          throw error
        }
      )
    } catch (error) {
      Alerter.error(downloadFileError(error))
    }
  }
}

const openFileDownloadError = error => {
  return isMissingFile(error)
    ? 'mobile.error.open_with.missing'
    : 'mobile.error.open_with.offline'
}

export const openFileWith = (id, filename) => {
  return async dispatch => {
    if (isMobileApp() && window.cordova.plugins.fileOpener2) {
      dispatch({ type: OPEN_FILE_WITH, id })
      const response = await cozy.client.files.downloadById(id).catch(error => {
        Alerter.error(openFileDownloadError(error))
        throw error
      })
      const blob = await response.blob()
      await saveAndOpenWithCordova(blob, filename).catch(() => {
        Alerter.error('mobile.error.open_with.noapp')
      })
    } else {
      Alerter.error('mobile.error.open_with.noapp')
    }
  }
}
