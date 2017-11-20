/* global cozy */

import { setBackupImages } from '../../actions/settings'
import {
  getPhotos,
  uploadLibraryItem,
  isAuthorized,
  getMediaFolderName,
  requestAuthorization
} from '../../lib/media'
import { isWifi } from '../../lib/network'
import { logException } from '../../lib/reporter'

export const cancelMediaBackup = () => ({ type: MEDIA_UPLOAD_CANCEL })

const currentMediaUpload = (media, uploadCounter, totalUpload) => ({
  type: CURRENT_UPLOAD,
  media,
  messageData: {
    current: uploadCounter,
    total: totalUpload
  }
})

const getDirID = async path => {
  const { _id } = await cozy.client.files.createDirectoryByPath(path)
  return _id
}

const canBackup = (isManualBackup, getState) => {
  const backupOnAnyNetworkType = !getState().mobile.settings.wifiOnly

  return (
    (isManualBackup || getState().mobile.settings.backupImages) &&
    (isWifi() || backupOnAnyNetworkType)
  )
}

export const startMediaBackup = (
  targetFolderName,
  isManualBackup = false
) => async (dispatch, getState) => {
  dispatch({ type: MEDIA_UPLOAD_START })

  if (!await isAuthorized()) {
    const promptForPermissions = isManualBackup
    const receivedAuthorisation = await updateValueAfterRequestAuthorization(
      promptForPermissions
    )
    // manual backup is only possible if the authorization is accepted
    if (isManualBackup && !receivedAuthorisation) isManualBackup = false
    // disable backupImages when authorization is refused
    if (getState().mobile.settings.backupImages && !receivedAuthorisation) {
      await dispatch(setBackupImages(false))
    }
  }

  if (canBackup(isManualBackup, getState)) {
    const photosOnDevice = await getPhotos()
    const alreadyUploaded = getState().mobile.mediaBackup.uploaded
    const photosToUpload = photosOnDevice.filter(
      photo => !alreadyUploaded.includes(photo.id)
    )
    const totalUpload = photosToUpload.length
    if (totalUpload > 0) {
      const dirID = await getDirID(targetFolderName)
      let uploadCounter = 0
      for (const photo of photosToUpload) {
        if (
          getState().mobile.mediaBackup.cancelMediaBackup ||
          !canBackup(isManualBackup, getState)
        ) {
          break
        }
        dispatch(currentMediaUpload(photo, uploadCounter++, totalUpload))
        await dispatch(uploadPhoto(targetFolderName, dirID, photo))
      }
    }

    cozy.client.settings.updateLastSync()
  } else {
    dispatch({ type: MEDIA_UPLOAD_ABORT })
  }

  dispatch({ type: MEDIA_UPLOAD_END })
}

const mediaUploadSucceed = ({ id }) => ({
  type: MEDIA_UPLOAD_SUCCESS,
  id
})

const uploadPhoto = (dirName, dirID, photo) => async (dispatch, getState) => {
  try {
    await cozy.client.files.statByPath(dirName + '/' + photo.fileName)
    dispatch(mediaUploadSucceed(photo))
    return
  } catch (_) {} // if an exception is throw, the file doesn't exist yet and we can safely upload it

  try {
    const MILLISECOND = 1
    const SECOND = 1000 * MILLISECOND
    const MINUTE = 60 * SECOND
    const maxBackupTime = 5 * MINUTE
    const timeout = setTimeout(() => {
      logException(`Backup duration exceeded ${maxBackupTime} milliseconds`)
    }, maxBackupTime)
    await uploadLibraryItem(dirID, photo)
    clearTimeout(timeout)
    dispatch(mediaUploadSucceed(photo))
  } catch (err) {
    console.warn('startMediaBackup upload item error')
    console.warn(JSON.stringify(err))
    console.info(JSON.stringify(photo))
    logException('Backup error: ' + JSON.stringify(err))
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

  const { updateStatusBackgroundService } = require('../../lib/background')
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

const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
const MEDIA_UPLOAD_ABORT = 'MEDIA_UPLOAD_ABORT'
const MEDIA_UPLOAD_SUCCESS = 'MEDIA_UPLOAD_SUCCESS'
const MEDIA_UPLOAD_CANCEL = 'MEDIA_UPLOAD_CANCEL'
const CURRENT_UPLOAD = 'CURRENT_UPLOAD'

const initialState = {
  uploading: false,
  cancelMediaBackup: false,
  abortedMediaBackup: false,
  uploaded: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_UPLOAD_START:
      return {
        ...state,
        uploading: true,
        cancelMediaBackup: false,
        abortedMediaBackup: false
      }
    case MEDIA_UPLOAD_CANCEL:
      return { ...state, cancelMediaBackup: true }
    case MEDIA_UPLOAD_ABORT:
      return { ...state, abortedMediaBackup: true }
    case MEDIA_UPLOAD_END:
      return {
        ...state,
        uploading: false,
        cancelMediaBackup: true,
        currentUpload: undefined
      }
    case MEDIA_UPLOAD_SUCCESS:
      return {
        ...state,
        uploaded: [...state.uploaded, action.id]
      }
    case CURRENT_UPLOAD:
      return {
        ...state,
        currentUpload: {
          media: action.media,
          message: action.message,
          messageData: action.messageData
        }
      }
    default:
      return state
  }
}
