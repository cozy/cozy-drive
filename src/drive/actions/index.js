/* global cozy */
import { isCordova } from '../mobile/lib/device'
import {
  saveFileWithCordova,
  saveAndOpenWithCordova,
  openOfflineFile,
  deleteOfflineFile
} from '../mobile/lib/filesystem'
import { openWithNoAppError } from '../mobile/actions'
import {
  isDirectory,
  isReferencedByAlbum,
  ALBUMS_DOCTYPE
} from '../ducks/files/files'
import * as availableOffline from '../ducks/files/availableOffline'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config.js'

export const OPEN_FOLDER = 'OPEN_FOLDER'
export const OPEN_FOLDER_SUCCESS = 'OPEN_FOLDER_SUCCESS'
export const OPEN_FOLDER_FAILURE = 'OPEN_FOLDER_FAILURE'
export const FETCH_RECENT = 'FETCH_RECENT'
export const FETCH_RECENT_SUCCESS = 'FETCH_RECENT_SUCCESS'
export const FETCH_RECENT_FAILURE = 'FETCH_RECENT_FAILURE'
export const FETCH_MORE_FILES = 'FETCH_MORE_FILES'
export const FETCH_MORE_FILES_SUCCESS = 'FETCH_MORE_FILES_SUCCESS'
export const FETCH_MORE_FILES_FAILURE = 'FETCH_MORE_FILES_FAILURE'
export const ABORT_ADD_FOLDER = 'ABORT_ADD_FOLDER'
export const CREATE_FOLDER = 'CREATE_FOLDER'
export const CREATE_FOLDER_FAILURE_GENERIC = 'CREATE_FOLDER_FAILURE_GENERIC'
export const CREATE_FOLDER_FAILURE_DUPLICATE = 'CREATE_FOLDER_FAILURE_DUPLICATE'
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const TRASH_FILES = 'TRASH_FILES'
export const TRASH_FILES_SUCCESS = 'TRASH_FILES_SUCCESS'
export const TRASH_FILES_FAILURE = 'TRASH_FILES_FAILURE'
export const DOWNLOAD_SELECTION = 'DOWNLOAD_SELECTION'
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE'
export const DOWNLOAD_FILE_E_MISSING = 'DOWNLOAD_FILE_E_MISSING'
export const DOWNLOAD_FILE_E_OFFLINE = 'DOWNLOAD_FILE_E_OFFLINE'
export const OPEN_FILE_WITH = 'OPEN_FILE_WITH'
export const OPEN_FILE_E_OFFLINE = 'OPEN_FILE_E_OFFLINE'
export const OPEN_FILE_E_NO_APP = 'OPEN_FILE_E_NO_APP'

// selectors

export const getOpenedFolderId = state => state.view.openedFolderId

export const extractFileAttributes = f => ({
  ...f.attributes,
  id: f._id,
  _id: f._id,
  _type: 'io.cozy.files',
  links: f.links,
  relationships: f.relationships
})

const HTTP_CODE_CONFLICT = 409
const ALERT_LEVEL_ERROR = 'error'

export const META_DEFAULTS = {
  cancelSelection: true,
  hideActionMenu: true
}

export const openFiles = () => {
  return async dispatch => dispatch(openFolder(ROOT_DIR_ID))
}

export const openRecent = () => {
  return async dispatch => dispatch(fetchRecentFiles())
}

export const openTrash = () => {
  return async dispatch => dispatch(openFolder(TRASH_DIR_ID))
}

export const openFolder = folderId => {
  return async (dispatch, getState) => {
    dispatch({
      type: OPEN_FOLDER,
      folderId,
      meta: {
        cancelSelection: true
      }
    })
    try {
      const settings = getState().settings
      const offline =
        settings.offline && settings.firstReplication && settings.indexes
      // PB: Pouch Mango queries don't return the total count...
      // and so the fetchMore button would not be displayed unless... see FileList
      const folder = offline
        ? await getFolderFromPouchDB(settings.indexes.folders, folderId)
        : await getFolderFromStack(folderId)

      return dispatch({
        type: OPEN_FOLDER_SUCCESS,
        folder,
        fileCount: folder.contents.meta.count || 0,
        files: folder.contents.data
      })
    } catch (err) {
      return dispatch({ type: OPEN_FOLDER_FAILURE, error: err })
    }
  }
}

const getFolderFromStack = async folderId => {
  const folder = await cozy.client.files.statById(folderId, false, {
    limit: 30
  })
  const parentId = folder.attributes.dir_id
  const parent =
    !!parentId &&
    (await cozy.client.files.statById(parentId).catch(ex => {
      if (ex.status === 403) {
        console.warn("User don't have access to parent folder")
      } else {
        throw ex
      }
    }))
  // folder.relations('contents') returns null when the trash is empty
  // the filter call is a temporary fix due to a cozy-client-js bug
  const files = folder.relations('contents').filter(f => f !== undefined) || []
  return {
    ...extractFileAttributes(folder),
    contents: {
      data: files.map(f => extractFileAttributes(f)),
      meta: {
        count: folder.relationships.contents.meta.count
      }
    },
    parent: !!parent && extractFileAttributes(parent)
  }
}

const getFolderContentsFromStack = async (folderId, skip = 0, limit = 30) => {
  const folder = await cozy.client.files.statById(folderId, false, {
    skip,
    limit
  })
  const files = folder.relations('contents').filter(f => f !== undefined) || []
  return files.map(c => extractFileAttributes(c))
}

const normalizeFileFromPouchDB = f => ({
  ...f,
  id: f._id,
  _type: 'io.cozy.files'
})

const getFolderFromPouchDB = async (index, folderId) => {
  const db = cozy.client.offline.getDatabase('io.cozy.files')
  const folder = await db.get(folderId)
  const parent = !!folder.dir_id && (await db.get(folder.dir_id))
  const files = await getFolderContentsFromPouchDB(index, folderId)
  return {
    ...normalizeFileFromPouchDB(folder),
    contents: {
      data: files,
      meta: {}
    },
    parent: !!parent && normalizeFileFromPouchDB(parent)
  }
}

const getFolderContentsFromPouchDB = async (
  index,
  folderId,
  skip = 0,
  limit = 30
) => {
  const db = cozy.client.offline.getDatabase('io.cozy.files')
  const resp = await db.find({
    selector: {
      dir_id: folderId,
      name: { $gte: null },
      type: { $gte: null }
    },
    use_index: index,
    sort: ['dir_id', { type: 'desc' }, { name: 'desc' }],
    limit,
    skip
  })
  const files = resp.docs
    .filter(f => f._id !== TRASH_DIR_ID)
    .map(f => normalizeFileFromPouchDB(f))
  return files
}

export const fetchMoreFiles = (folderId, skip, limit) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_MORE_FILES, folderId, skip, limit })
    try {
      const settings = getState().settings
      const offline =
        settings.offline && settings.firstReplication && settings.indexes
      const files = offline
        ? await getFolderContentsFromPouchDB(
            settings.indexes.folders,
            folderId,
            skip,
            limit
          )
        : await getFolderContentsFromStack(folderId, skip, limit)
      return dispatch({
        type: FETCH_MORE_FILES_SUCCESS,
        files,
        skip,
        limit
      })
    } catch (err) {
      return dispatch({ type: FETCH_MORE_FILES_FAILURE, error: err })
    }
  }
}

export const fetchRecentFiles = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_RECENT,
      meta: {
        cancelSelection: true
      }
    })

    try {
      const settings = getState().settings
      const isLocallyAvailable =
        isCordova() && settings.firstReplication && settings.indexes
      const files = await (isLocallyAvailable
        ? getRecentFilesFromPouchDB(settings.indexes.recent)
        : fetchRecentFilesFromStack())

      // fetch the list of parent dirs to get the path of recent files
      const parentDirIds = files
        .map(f => f.dir_id)
        .filter((value, index, self) => self.indexOf(value) === index)

      const parentFolders = await (isLocallyAvailable
        ? getFilesInBatchFromPouchDB(parentDirIds)
        : fetchFilesInBatchFromStack(parentDirIds))

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
    } catch (e) {
      return dispatch({ type: FETCH_RECENT_FAILURE, error: e })
    }
  }
}

const RECENT_FILES_INDEX_FIELDS = ['updated_at', 'trashed']
const RECENT_FILES_QUERY_OPTIONS = {
  selector: {
    updated_at: { $gt: null },
    trashed: false
  },
  sort: [{ updated_at: 'desc' }],
  limit: 30
}

export const fetchRecentFilesFromStack = async () => {
  const index = await cozy.client.data.defineIndex(
    'io.cozy.files',
    RECENT_FILES_INDEX_FIELDS
  )
  const resp = await cozy.client.files.query(index, {
    ...RECENT_FILES_QUERY_OPTIONS,
    wholeResponse: true
  })
  return resp.data.map(f => ({
    ...f,
    _id: f.id,
    _type: f.type,
    ...f.attributes
  }))
}

const getRecentFilesFromPouchDB = async index => {
  const db = cozy.client.offline.getDatabase('io.cozy.files')
  const files = await db.query(index, {
    limit: 30,
    include_docs: true,
    descending: true
  })
  return files.rows.map(f => ({
    ...f.doc,
    id: f.id,
    _type: 'io.cozy.files'
  }))
}

const fetchFilesInBatchFromStack = ids =>
  cozy.client.fetchJSON(
    'POST',
    '/data/io.cozy.files/_all_docs?include_docs=true',
    { keys: ids }
  )

const getFilesInBatchFromPouchDB = ids => {
  const db = cozy.client.offline.getDatabase('io.cozy.files')
  return db.allDocs({
    include_docs: true,
    keys: ids
  })
}

export const getFileDownloadUrl = async id => {
  const link = await cozy.client.files.getDownloadLinkById(id)
  return `${cozy.client._url}${link}`
}

export const openLocalFile = file => {
  return async dispatch => {
    if (!file.availableOffline) {
      console.error('openLocalFile: this file is not available offline')
    }
    openOfflineFile(file).catch(error => {
      console.error('openLocalFile', error)
      dispatch(
        openWithNoAppError({
          cancelSelection: true,
          hideActionMenu: true
        })
      )
    })
  }
}

export const uploadedFile = file => {
  return {
    type: UPLOAD_FILE_SUCCESS,
    file: extractFileAttributes(file)
  }
}

export const abortAddFolder = accidental => {
  const action = {
    type: ABORT_ADD_FOLDER,
    accidental
  }
  if (accidental) {
    action.alert = {
      message: 'alert.folder_abort'
    }
  }
  return action
}

export const createFolder = name => {
  return async (dispatch, getState) => {
    const existingFolder = getState().view.files.find(
      f => isDirectory(f) && f.name === name
    )
    const currentFileCount = getState().view.fileCount
    if (existingFolder) {
      dispatch({
        type: CREATE_FOLDER_FAILURE_DUPLICATE,
        alert: {
          message: 'alert.folder_name',
          messageData: { folderName: name }
        }
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
      dispatch({
        type: CREATE_FOLDER_SUCCESS,
        folder: extractFileAttributes(folder),
        currentFileCount
      })
    } catch (err) {
      if (err.response && err.response.status === HTTP_CODE_CONFLICT) {
        dispatch({
          type: CREATE_FOLDER_FAILURE_DUPLICATE,
          alert: {
            message: 'alert.folder_name',
            messageData: { folderName: name }
          }
        })
      } else {
        dispatch({
          type: CREATE_FOLDER_FAILURE_GENERIC,
          alert: {
            message: 'alert.folder_generic'
          }
        })
      }
      throw err
    }
  }
}

export const trashFiles = files => {
  const meta = META_DEFAULTS
  return async dispatch => {
    dispatch({ type: TRASH_FILES, files, meta })
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

        await cozy.client.sharingLinks.revokeLink(file)
      }
    } catch (err) {
      if (!isAlreadyInTrash(err)) {
        return dispatch({
          type: TRASH_FILES_FAILURE,
          alert: {
            message: 'alert.try_again'
          }
        })
      }
    }
    return dispatch({
      type: TRASH_FILES_SUCCESS,
      ids: files.map(f => f.id),
      alert: {
        message: 'alert.trash_file_success'
      }
    })
  }
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

export const toggleAvailableOffline = file => async (dispatch, getState) =>
  availableOffline.isAvailableOffline(getState())(file.id)
    ? dispatch(undoMakeAvailableOffline(file))
    : dispatch(makeAvailableOffline(file))

const undoMakeAvailableOffline = file => async dispatch => {
  const filename = file.id
  if (isCordova() && window.cordova.file) {
    deleteOfflineFile(filename)
  }
  dispatch(availableOffline.undoMakeAvailableOffline(file.id))
}

const makeAvailableOffline = file => async dispatch => {
  const response = await cozy.client.files
    .downloadById(file.id)
    .catch(error => {
      dispatch(downloadFileError(error, META_DEFAULTS))
      throw error
    })
  const blob = await response.blob()
  const filename = file.id

  if (isCordova() && window.cordova.file) {
    saveFileWithCordova(blob, filename)
  }
  dispatch(availableOffline.makeAvailableOffline(file.id))
}

const isMissingFile = error => error.status === 404

const downloadFileError = (error, meta) => {
  const message = isMissingFile(error)
    ? 'error.download_file.missing'
    : 'error.download_file.offline'
  const type = isMissingFile(error)
    ? DOWNLOAD_FILE_E_MISSING
    : DOWNLOAD_FILE_E_OFFLINE
  return { type, alert: { message, level: ALERT_LEVEL_ERROR }, meta }
}

const downloadFile = (file, meta) => {
  return async dispatch => {
    const response = await cozy.client.files
      .downloadById(file.id)
      .catch(error => {
        dispatch(downloadFileError(error, meta))
        throw error
      })
    const blob = await response.blob()
    const filename = file.name

    if (isCordova() && window.cordova.file) {
      saveFileWithCordova(blob, filename)
    } else {
      forceFileDownload(window.URL.createObjectURL(blob), filename)
    }
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

export const openFileWith = (id, filename) => {
  const meta = {
    cancelSelection: true,
    hideActionMenu: true
  }
  return async (dispatch, getState) => {
    if (isCordova() && window.cordova.plugins.fileOpener2) {
      dispatch({ type: OPEN_FILE_WITH, id })
      const response = await cozy.client.files.downloadById(id).catch(error => {
        console.error('downloadById', error)
        dispatch(downloadFileError(error, meta))
        throw error
      })
      const blob = await response.blob()
      await saveAndOpenWithCordova(blob, filename).catch(error => {
        console.error('openFileWithCordova', error)
        dispatch(openWithNoAppError(meta))
      })
    } else {
      dispatch(openWithNoAppError(meta))
    }
  }
}

// helpers
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
