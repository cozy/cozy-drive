import { saveAndOpenWithCordova } from 'cozy-client/dist/models/fsnative'
import { isDirectory } from 'cozy-client/dist/models/file'
import { receiveQueryResult } from 'cozy-client/dist/store'
import { isMobileApp } from 'cozy-device-helper'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import {
  getEncryptionKeyFromDirId,
  downloadEncryptedFile,
  isEncryptedFolder,
  decryptFile,
  isEncryptedFile
} from 'drive/lib/encryption'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'

const isMissingFileError = error => error.status === 404

const downloadFileError = error => {
  return isMissingFileError(error)
    ? 'error.download_file.missing'
    : 'error.download_file.offline'
}

const openFileDownloadError = error => {
  return isMissingFileError(error)
    ? 'mobile.error.open_with.missing'
    : 'mobile.error.open_with.offline'
}

/**
 * An instance of cozy-client
 * @typedef {object} CozyClient
 */

/**
 * downloadFiles - Triggers the download of one or multiple files by the browser
 *
 * @param {CozyClient} client
 * @param {array} files  One or more files to download
 */
export const downloadFiles = async (client, files, { vaultClient } = {}) => {
  const encryptionKey = await getEncryptionKeyFromDirId(client, files[0].dir_id)

  if (files.length === 1 && !isDirectory(files[0])) {
    const file = files[0]
    try {
      const filename = file.name
      if (encryptionKey) {
        return downloadEncryptedFile(client, vaultClient, {
          file,
          encryptionKey
        })
      } else {
        return client.collection(DOCTYPE_FILES).download(file, null, filename)
      }
    } catch (error) {
      Alerter.error(downloadFileError(error))
    }
  } else {
    if (encryptionKey) {
      // Multiple download is forbidden for encrypted files because we cannot generate client archive for now.
      return Alerter.error('error.download_file.encryption_many')
    }
    const hasEncryptedDirs = files.find(
      file => isDirectory(file) && isEncryptedFolder(file)
    )
    if (hasEncryptedDirs) {
      // We cannot download encrypted folder because we cannot generate client archive for now.
      return Alerter.error('error.download_file.encryption_many')
    }
    const ids = files.map(f => f.id)
    return client.collection(DOCTYPE_FILES).downloadArchive(ids)
  }
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

/**
 * trashFiles - Moves a set of files to the cozy trash
 *
 * @param {CozyClient} client
 * @param {array} files  One or more files to trash
 */
export const trashFiles = async (client, files) => {
  try {
    for (const file of files) {
      // TODO we should not go through a FileCollection to destroy the file, but
      // only do client.destroy(), I do not know what it did not update the internal
      // store correctly when I tried
      const { data: updatedFile } = await client
        .collection(DOCTYPE_FILES)
        .destroy(file)
      client.store.dispatch(
        receiveQueryResult(null, {
          data: updatedFile
        })
      )
      client.collection('io.cozy.permissions').revokeSharingLink(file)
    }

    Alerter.success('alert.trash_file_success')
  } catch (err) {
    if (!isAlreadyInTrash(err)) {
      Alerter.error('alert.try_again')
    }
  }
}

/**
 * openFileWith - Opens a file on a mobile device
 *
 * @param {CozyClient} client
 * @param {object} file   io.cozy.files document
 */
export const openFileWith = async (client, file, { vaultClient } = {}) => {
  if (isMobileApp() && window.cordova.plugins.fileOpener2) {
    let blob
    let originalMime = file.mime
    try {
      if (isEncryptedFile(file)) {
        const encryptionKey = await getEncryptionKeyFromDirId(
          client,
          file.dir_id
        )
        blob = await decryptFile(client, vaultClient, { file, encryptionKey })
        originalMime = client
          .collection(DOCTYPE_FILES)
          .getFileTypeFromName(file.name)
      } else {
        const response = await client
          .collection(DOCTYPE_FILES)
          .fetchFileContentById(file.id)

        blob = await response.blob()
      }
    } catch (error) {
      Alerter.error(openFileDownloadError(error))
      throw error
    }
    try {
      await saveAndOpenWithCordova(blob, { ...file, mime: originalMime })
    } catch (error) {
      Alerter.info('mobile.error.open_with.noapp', { fileMime: file.mime })
    }
  } else {
    Alerter.info('mobile.error.open_with.noapp', { fileMime: file.mime })
  }
}

export const restoreFiles = async (client, files) => {
  for (const file of files) {
    await client.collection(DOCTYPE_FILES).restore(file.id)
  }
}

export const deleteFilesPermanently = async (client, files) => {
  for (const file of files) {
    await client.collection(DOCTYPE_FILES).deleteFilePermanently(file.id)
  }
}

export const emptyTrash = async client => {
  Alerter.info('alert.empty_trash_progress')
  try {
    await client.collection(DOCTYPE_FILES).emptyTrash()
  } catch (err) {
    Alerter.error('alert.try_again')
  }
  Alerter.info('alert.empty_trash_success')
}
