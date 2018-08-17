import { isCordova } from './device'
import { getTranslateFunction } from './i18n'
import { getToken, getClientUrl } from './cozy-helper'
import { logException } from './reporter'

const hasCordovaPlugin = () => {
  return (
    isCordova() &&
    window.cordova.plugins !== undefined &&
    window.cordova.plugins.listLibraryItems !== undefined
  )
}

export const isAuthorized = async () => {
  if (!hasCordovaPlugin()) {
    return Promise.resolve(false)
  }
  return new Promise(resolve => {
    const success = () => resolve(true)
    const error = () => resolve(false)
    window.cordova.plugins.listLibraryItems.isAuthorized(success, error)
  })
}

export const requestAuthorization = async () => {
  if (!hasCordovaPlugin()) {
    return Promise.resolve(false)
  }
  return new Promise((resolve, reject) => {
    window.cordova.plugins.listLibraryItems.requestReadAuthorization(
      () => resolve(true),
      error => {
        if (!error.startsWith('Permission')) {
          console.warn(error)
          logException('requestAuthorization error:', error)
        }
        resolve(false)
      }
    )
  })
}

export const uploadLibraryItem = (
  dirID,
  libraryItem,
  progressCallback,
  thumbnailCallback
) => {
  if (hasCordovaPlugin()) {
    return new Promise(async (resolve, reject) => {
      // the cordova plugin is going to do the upload and needs all the infos to make a request to the stack
      const token = await getToken()
      const uri =
        getClientUrl() +
        '/files/' +
        encodeURIComponent(dirID) +
        '?Name=' +
        encodeURIComponent(libraryItem['fileName']) +
        '&Type=file&Tags=library&Executable=false'

      const payload = {
        id: dirID,
        libraryId: libraryItem['id'],
        mimeType: libraryItem['mimeType'],
        filePath: libraryItem['filePath'],
        serverUrl: uri,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': libraryItem['mimeType']
        }
      }

      window.cordova.plugins.listLibraryItems.uploadItem(
        payload,
        result => {
          if (result.errors) reject(result.errors)
          else if (result.progress !== undefined)
            progressCallback(result.progress)
          else if (result.thumbnail) thumbnailCallback(result.thumbnail)
          else {
            resolve(result)
          }
        },
        reject
      )
    })
  }

  return Promise.resolve()
}

export const getPhotos = async () => {
  const defaultReturn = []

  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.listLibraryItems.listItems(
        true,
        true,
        false, // includePictures, includeVideos, includeCloud
        response => resolve(response.library),
        err => {
          console.warn(err)
          resolve(defaultReturn)
        }
      )
    })
  }

  return Promise.resolve(defaultReturn)
}

export const getMediaFolderName = () => {
  const t = getTranslateFunction()
  return t('mobile.settings.media_backup.media_folder')
}
