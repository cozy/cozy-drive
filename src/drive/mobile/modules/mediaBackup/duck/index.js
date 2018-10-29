/* global cozy */
import throttle from 'lodash/throttle'
import {
  getPhotos,
  uploadLibraryItem,
  isAuthorized,
  requestAuthorization
} from 'drive/mobile/lib/media'
import { getTranslateFunction } from 'drive/mobile/lib/i18n'
import { isWifi } from 'drive/mobile/lib/network'
import { logException } from 'drive/lib/reporter'
import { setBackupImages } from 'drive/mobile/modules/settings/duck'
import {
  MEDIA_UPLOAD_START,
  MEDIA_UPLOAD_END,
  MEDIA_UPLOAD_ABORT,
  MEDIA_UPLOAD_SUCCESS,
  MEDIA_UPLOAD_CANCEL,
  MEDIA_UPLOAD_QUOTA,
  CURRENT_UPLOAD,
  CURRENT_UPLOAD_PROGRESS
} from './reducer'
import { checkCorruptedFiles } from './checkCorruptedFiles'
import { DOCTYPE_REF_PHOTOS, DOCTYPE_REF_BACKUP } from 'drive/lib/doctypes'

const ERROR_CODE_TOO_LARGE = 413

export const cancelMediaBackup = () => ({ type: MEDIA_UPLOAD_CANCEL })

const currentMediaUpload = (media, uploadCounter, totalUpload) => ({
  type: CURRENT_UPLOAD,
  media,
  messageData: {
    current: uploadCounter,
    total: totalUpload
  }
})

const getFoldersWithReference = async reference => {
  try {
    const referencedFolders = await cozy.client.fetchJSON(
      'POST',
      '/files/_find',
      {
        selector: {
          referenced_by: {
            $elemMatch: {
              type: reference
            }
          }
        },
        sort: [{ created_at: 'desc' }]
      }
    )

    return referencedFolders.filter(
      folder => /^\/\.cozy_trash/.test(folder.attributes.path) === false
    )
  } catch (err) {
    if (err.reason.errors[0].title === 'no_usable_index') {
      await initCreatedAtIndex()
      return getFoldersWithReference(reference)
    } else {
      throw err
    }
  }
}

const initCreatedAtIndex = () =>
  cozy.client.fetchJSON('POST', '/data/io.cozy.files/_index', {
    index: {
      fields: ['created_at']
    }
  })

const addFolderReference = (folderId, reference) =>
  cozy.client.fetchJSON(
    'POST',
    `/files/${folderId}/relationships/referenced_by`,
    {
      data: [
        {
          type: reference,
          id: reference
        }
      ]
    }
  )

const getOrCreateFolderWithReference = async (path, reference) => {
  const referencedFolders = await getFoldersWithReference(reference)

  if (referencedFolders.length) {
    return referencedFolders[0]
  } else {
    const dir = await cozy.client.files.createDirectoryByPath(path, false)
    await addFolderReference(dir._id, reference)
    return dir
  }
}

const getUploadDir = async () => {
  const uploadedFolders = await getFoldersWithReference(DOCTYPE_REF_BACKUP)

  if (uploadedFolders.length >= 1) {
    // There can be more than one referenced folder in case of consecutive delete/restores. We always want to return the most recently used.
    return uploadedFolders[0]
  } else {
    const t = getTranslateFunction()
    const mediaFolderName = t('mobile.settings.media_backup.media_folder')
    const uploadFolderName = t('mobile.settings.media_backup.backup_folder')
    const legacyUploadFolderName = t(
      'mobile.settings.media_backup.legacy_backup_folder'
    )

    await getOrCreateFolderWithReference(
      `/${mediaFolderName}`,
      DOCTYPE_REF_PHOTOS
    )

    try {
      const legacyFolder = await cozy.client.files.statByPath(
        `/${mediaFolderName}/${legacyUploadFolderName}`
      )
      await addFolderReference(legacyFolder._id, DOCTYPE_REF_BACKUP)
      return legacyFolder
    } catch (err) {
      if (err.status === 404) {
        // the legacy folder doesn't exist, so we create the new one
        const uploadFolder = await getOrCreateFolderWithReference(
          `/${mediaFolderName}/${uploadFolderName}`,
          DOCTYPE_REF_BACKUP
        )
        return uploadFolder
      } else {
        throw err
      }
    }
  }
}

const canBackup = (isManualBackup, getState) => {
  const backupOnAnyNetworkType = !getState().mobile.settings.wifiOnly

  return (
    (isManualBackup || getState().mobile.settings.backupImages) &&
    (isWifi() || backupOnAnyNetworkType)
  )
}

export const startMediaBackup = (isManualBackup = false) => async (
  dispatch,
  getState,
  client
) => {
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
    try {
      const photosOnDevice = await getPhotos()
      const alreadyUploaded = getState().mobile.mediaBackup.uploaded
      //! TODO : RM after a while. Deal with photos here
      await checkCorruptedFiles(photosOnDevice, dispatch)

      const photosToUpload = photosOnDevice.filter(
        photo => !alreadyUploaded.includes(photo.id)
      )

      const totalUpload = photosToUpload.length
      if (totalUpload > 0) {
        const {
          _id: uploadDirId,
          attributes: { path: uploadDirPath }
        } = await getUploadDir()
        let uploadCounter = 0
        for (const photo of photosToUpload) {
          if (
            getState().mobile.mediaBackup.cancelMediaBackup ||
            getState().mobile.mediaBackup.diskQuotaReached ||
            !canBackup(isManualBackup, getState)
          ) {
            break
          }
          dispatch(currentMediaUpload(photo, uploadCounter++, totalUpload))
          await dispatch(uploadPhoto(uploadDirPath, uploadDirId, photo))
        }
      }

      cozy.client.settings.updateLastSync()
    } catch (e) {
      dispatch({ type: MEDIA_UPLOAD_ABORT })
      if (!e.message.match(/Failed to fetch/))
        logException(`Unexpected error during the files backup (${e.message})`)
    }
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

  const MILLISECOND = 1
  const SECOND = 1000 * MILLISECOND
  const MINUTE = 60 * SECOND
  const maxBackupTime = 5 * MINUTE
  const timeout = setTimeout(() => {
    console.info(JSON.stringify(photo))
    logException(`Backup duration exceeded ${maxBackupTime} milliseconds`)
  }, maxBackupTime)
  try {
    const onProgressUpdate = progress => {
      dispatch({ type: CURRENT_UPLOAD_PROGRESS, progress })
    }

    const onThumbnailGenerated = thumbnailUrl => {}

    await uploadLibraryItem(
      dirID,
      photo,
      throttle(onProgressUpdate, 500),
      onThumbnailGenerated
    )
    clearTimeout(timeout)
    dispatch(mediaUploadSucceed(photo))
  } catch (err) {
    if (err.code && parseInt(err.code) === ERROR_CODE_TOO_LARGE) {
      clearTimeout(timeout)
      dispatch({ type: MEDIA_UPLOAD_QUOTA })
    } else {
      console.warn('startMediaBackup upload item error')
      console.warn(JSON.stringify(err))
      console.info(JSON.stringify(photo))
      const reason = err.message ? err.message : JSON.stringify(err)
      logException('Backup error: ' + reason, null, ['backup error'])
    }
  }
}

export const backupImages = backupImages => async (dispatch, getState) => {
  // TODO: it looks like the media backup is triggered twice at app init, but I couldn't figure why :/
  // This fixes the issue, but we'll need to figure out why it is triggered twice...
  if (getState().mobile.mediaBackup.running === true) {
    return
  }
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

  const {
    updateStatusBackgroundService
  } = require('drive/mobile/lib/background')
  updateStatusBackgroundService(backupImages)
  if (backupImages) {
    dispatch(startMediaBackup())
  }

  return backupImages
}

const updateValueAfterRequestAuthorization = async value => {
  if (value) {
    value = await requestAuthorization()
  }
  return value
}

export { default } from './reducer'
