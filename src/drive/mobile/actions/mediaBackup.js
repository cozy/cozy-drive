/* global cozy */

import { setBackupImages } from './settings'
import {
  getPhotos,
  uploadLibraryItem,
  isAuthorized,
  getMediaFolderName,
  requestAuthorization
} from '../lib/media'
import { updateStatusBackgroundService } from '../lib/background'
import { backupAllowed } from '../lib/network'
import { logException } from '../lib/reporter'

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
export const MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS'
export const MEDIA_UPLOAD_CANCEL = 'MEDIA_UPLOAD_CANCEL'
export const CURRENT_UPLOAD = 'CURRENT_UPLOAD'

const ERROR_CODE_CONFLICT = 409

const startMediaUpload = () => ({ type: MEDIA_UPLOAD_START })
const endMediaUpload = () => ({ type: MEDIA_UPLOAD_END })
const successMediaUpload = media => ({
  type: MEDIA_UPLOAD_SUCCESS,
  id: media.id
})
const currentUploading = (media, uploadCounter, totalUpload) => ({
  type: CURRENT_UPLOAD,
  media,
  message: 'mobile.settings.media_backup.media_upload',
  messageData: {
    upload_counter: uploadCounter,
    total_upload: totalUpload
  }
})

async function getDirID(path) {
  const dir = await cozy.client.files.createDirectoryByPath(path)

  return dir._id
}

export const cancelMediaBackup = () => ({ type: MEDIA_UPLOAD_CANCEL })

/*
  dir: It's the folder where picture will be uploaded
  force: Even if the settings are not activated, it uploads the photos
*/
export const startMediaBackup = (dir, force = false) => async (
  dispatch,
  getState
) => {
  const canBackup = (force, getState) => {
    return (
      force ||
      (getState().mobile.settings.backupImages &&
        backupAllowed(getState().mobile.settings.wifiOnly))
    )
  }

  dispatch(startMediaUpload())

  if (!await isAuthorized()) {
    // force is only possible if the authorization is accepted
    force = await updateValueAfterRequestAuthorization(force)
    // disable backupImages when authorization is refused
    if (getState().mobile.settings.backupImages && !force) {
      await dispatch(setBackupImages(false))
    }
  }

  if (canBackup(force, getState)) {
    const photosOnDevice = await getPhotos()
    const alreadyUploaded = getState().mobile.mediaBackup.uploaded
    const photosToUpload = photosOnDevice.filter(
      photo => !alreadyUploaded.includes(photo.id)
    )
    const totalUpload = photosToUpload.length
    if (totalUpload > 0) {
      const dirID = await getDirID(dir)
      let uploadCounter = 0
      for (const photo of photosToUpload) {
        if (
          getState().mobile.mediaBackup.cancelMediaBackup ||
          !canBackup(force, getState)
        ) {
          break
        }
        dispatch(currentUploading(photo, uploadCounter++, totalUpload))
        await dispatch(uploadPhoto(dirID, photo))
      }
    }
  }

  cozy.client.settings.updateLastSync()
  dispatch(endMediaUpload())
}

const uploadPhoto = (dirID, photo) => async (dispatch, getState) => {
  try {
    await uploadLibraryItem(dirID, photo)
    dispatch(successMediaUpload(photo))
  } catch (err) {
    if (err.code && parseInt(err.code) === ERROR_CODE_CONFLICT) {
      // since it's a conflict error, the file *is* actually on the server, so we consider it a success
      dispatch(successMediaUpload(photo))
    } else {
      console.warn('startMediaBackup upload item error')
      console.warn(JSON.stringify(err))
      console.info(JSON.stringify(photo))
      logException('startMediaBackup error')
    }
  }
}

// backupImages

export const backupImages = backupImages => async (dispatch, getState) => {
  if (backupImages === undefined) {
    backupImages = getState().mobile.settings.backupImages
  } else {
    await dispatch(setBackupImages(backupImages))
  }

  const isAuthorized = await updateValueAfterRequestAuthorization(backupImages)
  if (backupImages && !isAuthorized) {
    backupImages = isAuthorized
    dispatch(setBackupImages(backupImages))
  }

  updateStatusBackgroundService(backupImages)
  if (backupImages) {
    dispatch(startMediaBackup(getMediaFolderName()))
  }

  return backupImages
}

const updateValueAfterRequestAuthorization = async value => {
  if (value) {
    value = await requestAuthorization()
  }
  return value
}
