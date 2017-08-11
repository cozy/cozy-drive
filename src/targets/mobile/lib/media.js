/* global cozy FileUploadOptions FileTransfer */
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
    window.cordova.plugins.photoLibrary.getLibrary(success, error, {includeCloudData: false, includeVideos: true})
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

// export const getBlob = async (libraryItem) => {
//   if (hasCordovaPlugin()) {
//     return new Promise((resolve, reject) => {
//       window.cordova.plugins.photoLibrary.getLibraryItem(
//         libraryItem,
//         fullPhotoBlob => resolve(fullPhotoBlob),
//         err => reject(err)
//       )
//     })
//   }

//   return Promise.resolve('')
// }

// -------------------------------------------------------------------------
// LIBRARY ITEM UPLOAD
function onUploadSuccess (r) {
  console.log('Code = ' + r.responseCode)
  console.log('Response = ' + r.response)
  console.log('Sent = ' + r.bytesSent)
}

function onUploadFail (error) {
  alert('An error has occurred: Code = ' + error.code)
  console.log('upload error source ' + error.source)
  console.log('upload error target ' + error.target)
}

export const uploadLibraryItem = async (dirID, libraryItem) => {
  if (hasCordovaPlugin()) {
    return new Promise(async (resolve, reject) => {
      // window.cordova.plugins.photoLibrary.getLibraryItem(
      //   libraryItem,
      //   fullPhotoBlob => resolve(fullPhotoBlob),
      //   err => reject(err)
      // )
      var uri = encodeURI(cozy.client._url + '/files/' + dirID)
      var options = new FileUploadOptions()
      console.log(cozy.client)
      console.log(libraryItem)

      var credentials = await cozy.client.authorize()
      var token = credentials.token.accessToken
      options.fileKey = 'file'
      options.fileName = libraryItem['id'] // fileURL.substr(fileURL.lastIndexOf('/') + 1);
      options.mimeType = libraryItem['mimeType']
      options.headers = {
        'Authorization': 'Basic ' + token
      } // get that in plugin code
      console.log(options)
      var ft = new FileTransfer()
      ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          console.log('percent' + (progressEvent.loaded / progressEvent.total))
        } else {
          console.log('increment')
        }
      }
      ft.upload(libraryItem['id'], uri, onUploadSuccess, onUploadFail, options)
    })
  }

  return Promise.resolve('')
}
// -------------------------------------------------------------------------

export const getPhotos = async () => {
  const defaultReturn = []

  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      window.cordova.plugins.photoLibrary.getLibrary(
        (response) => resolve(response.library),
        (err) => {
          console.warn(err)
          resolve(defaultReturn)
        },
        {includeCloudData: false, includeVideos: true}
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
