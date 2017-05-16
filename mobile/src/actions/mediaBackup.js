/* global cozy */

import { setBackupImages } from './settings'
import { getFilteredPhotos, getBlob, isAuthorized, getMediaFolderName, requestAuthorization } from '../lib/media'
import { updateStatusBackgroundService } from '../lib/background'
import { backupAllowed } from '../lib/network'
import { HTTP_CODE_CONFLICT } from '../../../src/actions'
import { logInfo, logException } from '../lib/reporter'

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
export const MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS'
export const MEDIA_UPLOAD_CANCEL = 'MEDIA_UPLOAD_CANCEL'
export const CURRENT_UPLOAD = 'CURRENT_UPLOAD'

const startMediaUpload = () => ({ type: MEDIA_UPLOAD_START })
const endMediaUpload = () => ({ type: MEDIA_UPLOAD_END })
const successMediaUpload = (media) => ({ type: MEDIA_UPLOAD_SUCCESS, id: media.id })
const currentUploading = (media, uploadCounter, totalUpload) => (
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

export const cancelMediaBackup = () => ({ type: MEDIA_UPLOAD_CANCEL })

/*
  dir: It's the folder where picture will be uploaded
  force: Even if the settings are not activated, it uploads the photos
*/
export const startMediaBackup = (dir, force = false) => async (dispatch, getState) => {
  const canBackup = (force, getState) => {
    return force || (
      getState().mobile.settings.backupImages &&
      backupAllowed(getState().mobile.settings.wifiOnly)
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
    const photosOnDevice = await getFilteredPhotos()
    const alreadyUploaded = getState().mobile.mediaBackup.uploaded
    const photosToUpload = photosOnDevice.filter(photo => !alreadyUploaded.includes(photo.id))
    const dirID = await getDirID(dir)
    const totalUpload = photosToUpload.length
    let uploadCounter = 0
    for (const photo of photosToUpload) {
      if (getState().mobile.mediaBackup.cancelMediaBackup || !canBackup(force, getState)) {
        break
      }
      dispatch(currentUploading(photo, uploadCounter++, totalUpload))
      await dispatch(uploadPhoto(dirID, photo))
    }
  }

  dispatch(endMediaUpload())
}

const uploadPhoto = (dirID, photo) => async (dispatch, getState) => {
  const logError = (err, msg) => {
    console.warn(msg)
    console.warn(err)
    console.info(JSON.stringify(photo))
    logException('startMediaBackup error')
  }

  try {
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
      } else if (err === 'Could not fetch the image') {
        dispatch(successMediaUpload(photo))
      } else {
        logError(err, 'startMediaBackup create error')
      }
    })
  } catch (err) {
    logError(err, 'startMediaBackup getBlob error')
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

  backupImagesAnalytics(backupImages, getState)
  updateStatusBackgroundService(backupImages)
  if (backupImages) {
    dispatch(startMediaBackup(getMediaFolderName()))
  }

  return backupImages
}

const updateValueAfterRequestAuthorization = async (value) => {
  if (value) {
    value = await requestAuthorization()
  }
  return value
}

const backupImagesAnalytics = (backupImages, getState) => {
  if (getState().mobile.settings.analytics) {
    if (backupImages) {
      logInfo('settings: backup images is enabled')
    } else {
      logInfo('settings: backup images is disabled')
    }
  }
}
