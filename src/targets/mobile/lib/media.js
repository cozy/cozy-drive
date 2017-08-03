import { isCordova, isAndroid } from './device'
import { _polyglot, initTranslation } from 'cozy-ui/react/I18n/translation'
import { getLang } from './init'
import { logException } from './reporter'

const hasCordovaPlugin = () => {
  return isCordova() &&
    window.cordova.plugins !== undefined &&
    window.cordova.plugins.photoLibrary !== undefined
}

export const isAuthorized = async () => {
  if (!hasCordovaPlugin()) {
    return Promise.resolve(false)
  }
  return new Promise(resolve => {
    const success = () => resolve(true)
    const error = () => resolve(false)
    window.cordova.plugins.photoLibrary.getLibrary(success, error)
  })
}

export const requestAuthorization = async () => {
  if (!hasCordovaPlugin()) {
    return Promise.resolve(false)
  }
  return new Promise((resolve, reject) => {
    window.cordova.plugins.photoLibrary.requestAuthorization(
      () => resolve(true),
      (error) => {
        if (!error.startsWith('Permission')) {
          console.warn(error)
          logException('requestAuthorization error:', error)
        }
        resolve(false)
      },
      {
        read: true
      }
    )
  })
}

export const getBlob = async (libraryItem) => {
  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.getPhoto(
        libraryItem,
        fullPhotoBlob => resolve(fullPhotoBlob),
        err => reject(err)
      )
    })
  }

  return Promise.resolve('')
}

export const getPhotos = async () => {
  const defaultReturn = []

  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.getLibrary(
        (response) => resolve(response.library),
        (err) => {
          console.warn(err)
          resolve(defaultReturn)
        }
      )
    })
  }

  return Promise.resolve(defaultReturn)
}

export const getFilteredPhotos = async () => {
  let photos = await getPhotos()

  if (hasCordovaPlugin() && isAndroid()) {
    photos = photos.filter((photo) => photo.id.indexOf('DCIM') !== -1)
  }

  return Promise.resolve(photos)
}

export const getMediaFolderName = () => {
  if (_polyglot === undefined) {
    const lang = getLang()
    const dictRequire = (lang) => require(`../../../locales/${lang}`)
    initTranslation(lang, dictRequire)
  }
  const dir = _polyglot.t('mobile.settings.media_backup.media_folder')

  return dir
}
