import throttle from 'lodash/throttle'
import { uploadLibraryItem } from 'drive/mobile/lib/media'
import {
  getReferencedFolders,
  getOrCreateFolderWithReference,
  REF_PHOTOS,
  REF_BACKUP
} from 'folder-references'
import { fixMagicFolderName } from './fixBackupFolderNamesBug'
import { logException } from 'drive/lib/reporter'

import {
  MEDIA_UPLOAD_QUOTA,
  CURRENT_UPLOAD_PROGRESS,
  MEDIA_UPLOAD_SUCCESS
} from './reducer'

import logger from 'lib/logger'

const ERROR_CODE_TOO_LARGE = 413

export const getUploadDir = async (client, t) => {
  const uploadedFolders = await getReferencedFolders(client, REF_BACKUP)
  if (uploadedFolders.length >= 1) {
    //Let's fix the bug introduced between 1.18.18 and 1.18.24
    await fixMagicFolderName(client, uploadedFolders[0])
    // There can be more than one referenced folder in case of consecutive delete/restores. We always want to return the most recently used.
    return uploadedFolders[0]
  } else {
    const mediaFolderName = t('mobile.settings.media_backup.media_folder')
    const uploadFolderName = t('mobile.settings.media_backup.backup_folder')
    const legacyUploadFolderName = t(
      'mobile.settings.media_backup.legacy_backup_folder'
    )

    await getOrCreateFolderWithReference(
      client,
      `/${mediaFolderName}`,
      REF_PHOTOS
    )

    try {
      const { data: legacyFolder } = await client
        .collection('io.cozy.files')
        .statByPath(`/${mediaFolderName}/${legacyUploadFolderName}/plop`)
      await getOrCreateFolderWithReference(
        client,
        `/${mediaFolderName}/${legacyUploadFolderName}`,
        REF_BACKUP
      )
      return legacyFolder
    } catch (err) {
      if (err.status === 404) {
        // the legacy folder doesn't exist, so we create the new one
        const uploadFolder = await getOrCreateFolderWithReference(
          client,
          `/${mediaFolderName}/${uploadFolderName}`,
          REF_BACKUP
        )
        return uploadFolder
      } else {
        throw err
      }
    }
  }
}
const mediaUploadSucceed = ({ id }) => ({
  type: MEDIA_UPLOAD_SUCCESS,
  id
})
export const uploadPhoto = (
  dirName,
  dirID,
  photo,
  client
) => async dispatch => {
  try {
    const path = dirName + '/' + photo.fileName
    await client.collection('io.cozy.files').statByPath(path)

    dispatch(mediaUploadSucceed(photo))
    return
  } catch (_) {
    //logger.log('_')
  } // if an exception is throw, the file doesn't exist yet and we can safely upload it

  const MILLISECOND = 1
  const SECOND = 1000 * MILLISECOND
  const MINUTE = 60 * SECOND
  const maxBackupTime = 5 * MINUTE
  const timeout = setTimeout(() => {
    logger.info(JSON.stringify(photo))
    logException(`Backup duration exceeded ${maxBackupTime} milliseconds`)
  }, maxBackupTime)
  try {
    const onProgressUpdate = progress => {
      dispatch({ type: CURRENT_UPLOAD_PROGRESS, progress })
    }

    const onThumbnailGenerated = () => {}

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
      logger.warn('startMediaBackup upload item error')
      logger.warn(JSON.stringify(err))
      logger.info(JSON.stringify(photo))
      const reason = err.message ? err.message : JSON.stringify(err)
      logException('Backup error: ' + reason, null, ['backup error'])
    }
  }
}
