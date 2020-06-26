import { models } from 'cozy-client'
import { receiveQueryResult } from 'cozy-client/dist/store'
import { isMobileApp, isIOS } from 'cozy-device-helper'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { isReferencedByAlbum } from 'drive/web/modules/drive/files' // TODO move to cozy-client models
import { forceFileDownload } from 'cozy-stack-client/dist/utils'
import {
  saveFileWithCordova,
  saveAndOpenWithCordova
} from 'drive/mobile/lib/filesystem'

const { file: fileModel } = models
const { isDirectory } = fileModel

export const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

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
export const downloadFiles = async (client, files) => {
  if (files.length === 1 && !isDirectory(files[0])) {
    const file = files[0]

    try {
      const downloadURL = await client
        .collection('io.cozy.files')
        .getDownloadLinkById(file.id)
      const filename = file.name

      forceFileDownload(
        `${client.getStackClient().uri}${downloadURL}?Dl=1`,
        filename
      )
    } catch (error) {
      Alerter.error(downloadFileError(error))
    }
  } else {
    const ids = files.map(f => f.id)
    const href = await client
      .collection('io.cozy.files')
      .getArchiveLinkByIds(ids)
    const fullpath = `${client.getStackClient().uri}${href}`
    forceFileDownload(fullpath, 'files.zip')
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
        .collection('io.cozy.files')
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
 * exportFilesNative - Triggers a prompt to download a file on mobile devices
 *
 * @param {CozyClient} client
 * @param {array} files    One or more files to download
 * @param {string} filename The name of the file that will be saved
 */
export const exportFilesNative = async (client, files, filename) => {
  const downloadAllFiles = files.map(async file => {
    const response = await client
      .collection('io.cozy.files')
      .fetchFileContent(file)

    const blob = await response.blob()
    const filenameToUse = filename ? filename : file.name
    const localFile = await saveFileWithCordova(blob, filenameToUse)
    return localFile.nativeURL
  })

  try {
    Alerter.info('alert.preparing', {
      duration: Math.min(downloadAllFiles.length * 2000, 6000)
    })
    // TODO use a promise pool here
    const urls = await Promise.all(downloadAllFiles)
    if (urls.length === 1 && isIOS()) {
      //TODO
      //It seems that files: is not well supported on iOS. url seems to work well
      //at with one file. Need to check when severals
      window.plugins.socialsharing.shareWithOptions(
        {
          url: urls[0]
        },
        result => {
          if (result.completed === true) {
            Alerter.success('mobile.download.success')
          }
        },
        error => {
          throw error
        }
      )
    } else {
      window.plugins.socialsharing.shareWithOptions(
        {
          files: urls
        },
        null,
        error => {
          throw error
        }
      )
    }
  } catch (error) {
    Alerter.error(downloadFileError(error))
  }
}

/**
 * openFileWith - Opens a file on a mobile device
 *
 * @param {CozyClient} client
 * @param {object} file   io.cozy.files document
 */
export const openFileWith = async (client, file) => {
  if (isMobileApp() && window.cordova.plugins.fileOpener2) {
    let fileData
    try {
      fileData = await client.collection('io.cozy.files').fetchFileContent(file)
    } catch (error) {
      Alerter.error(openFileDownloadError(error))
      throw error
    }

    const blob = await fileData.blob()
    try {
      await saveAndOpenWithCordova(blob, file.name)
    } catch (error) {
      Alerter.error('mobile.error.open_with.noapp')
    }
  } else {
    Alerter.error('mobile.error.open_with.noapp')
  }
}
