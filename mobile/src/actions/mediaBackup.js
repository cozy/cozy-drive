/* global cozy */

import { getFilteredPhotos, getBlob } from '../lib/media'
import { backupAllowed } from '../lib/network'
import { HTTP_CODE_CONFLICT } from '../../../src/actions'

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
export const MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS'
export const CURRENT_UPLOAD = 'CURRENT_UPLOAD'

let cancelUploading = false

export const startMediaUpload = () => {
  cancelUploading = false
  return { type: MEDIA_UPLOAD_START }
}
export const endMediaUpload = () => {
  cancelUploading = true
  return { type: MEDIA_UPLOAD_END }
}
export const successMediaUpload = (media) => ({ type: MEDIA_UPLOAD_SUCCESS, id: media.id })
export const currentUploading = (media, uploadCounter, totalUpload) => (
  {
    type: CURRENT_UPLOAD,
    media,
    message: 'mobile.settings.media_backup.media_upload',
    messageData: {
      upload_counter: uploadCounter,
      total_upload: totalUpload
    }
  }
)

async function getDirID (dir) {
  const targetDirectory = await cozy.client.files.createDirectory({
    name: dir,
    dirID: 'io.cozy.files.root-dir'
  }).catch(err => {
    if (err.status === 409) { // directory already exists
      return cozy.client.files.statByPath(`/${dir}`)
    }
    throw err
  })
  return targetDirectory._id
}

export const mediaBackup = (dir) => async (dispatch, getState) => {
  if (backupAllowed(getState().mobile.settings.wifiOnly)) {
    const photosOnDevice = await getFilteredPhotos()
    const alreadyUploaded = getState().mobile.mediaBackup.uploaded
    const photosToUpload = photosOnDevice.filter(photo => !alreadyUploaded.includes(photo.id))
    const dirID = await getDirID(dir)
    const totalUpload = photosToUpload.length
    let uploadCounter = 0
    for (const photo of photosToUpload) {
      if (cancelUploading) {
        break
      }
      if (backupAllowed(getState().mobile.settings.wifiOnly)) {
        dispatch(currentUploading(photo, uploadCounter++, totalUpload))
        const blob = await getBlob(photo)
        const options = {
          dirID,
          name: photo.fileName
        }
        await cozy.client.files.create(blob, options).then(() => {
          dispatch(successMediaUpload(photo))
        }).catch(err => {
          if (err.status === HTTP_CODE_CONFLICT) {
            dispatch(successMediaUpload(photo))
          }
          console.log(err)
        })
      }
    }
  }
}
