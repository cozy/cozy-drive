import { getTranslateFunction } from 'drive/mobile/lib/i18n'
import { REF_PHOTOS, getOrCreateFolderWithReference } from 'folder-references'
import { ROOT_DIR_ID } from 'drive/constants/config'
import { handleConflictOnMove } from './handleConflictOnMove'
/**
- eventuellement créer le dossier photos
- supprimer /photos/t(backup) si vide
- renommage dossier backup
- déplacer t(backup) folder avec gestion conflits
- supprimer la ref de media_folder
- mettre la ref sur photosFolder
- on supprime pas l'ancien media_foldr au cas ou il rete des choses dedans
*/

export const fixMagicFolderName = async (client, savedFromMyDeviceFolder) => {
  //LET'S FIX the bug introduced in 1.18.18. Used in 1.18.24 release
  if (
    savedFromMyDeviceFolder.name !==
    'mobile.settings.media_backup.backup_folder'
  )
    return null // early exit if nothing to do

  const t = getTranslateFunction()
  const photosRootPath = `/${t('mobile.settings.media_backup.media_folder')}`
  const photosRootPathWithoutTranslation =
    '/mobile.settings.media_backup.media_folder'
  const newNameForSavedFromMyDevice = t(
    'mobile.settings.media_backup.backup_folder'
  )
  const newNamePhotoFolder = t('mobile.settings.media_backup.media_folder')

  let photosRootFolder
  try {
    photosRootFolder = await client
      .collection('io.cozy.files')
      .statByPath(photosRootPath)
  } catch (e) {
    // marche pas
    photosRootFolder = await client
      .collection('io.cozy.files')
      .createDirectory({ dirId: ROOT_DIR_ID, name: newNamePhotoFolder })
  }

  try {
    const pathSavedFromMobileFolder = `${photosRootPath}/${newNameForSavedFromMyDevice}`
    const folderSyncPhoto = await client
      .collection('io.cozy.files')
      .statByPath(pathSavedFromMobileFolder)
    console.log('folderSyncPhoto', folderSyncPhoto)

    const hasEmptyRightFolder =
      folderSyncPhoto.included && folderSyncPhoto.included.length === 0
        ? true
        : false

    if (hasEmptyRightFolder) {
      await client
        .collection('io.cozy.files')
        .deleteFilePermanently(folderSyncPhoto.data.id)
    }
  } catch (e) {
    console.warn('error', e)
  }

  const newCreatedFromMyDeviceFolder = await client
    .collection('io.cozy.files')
    .updateAttributes(savedFromMyDeviceFolder.id, {
      name: newNameForSavedFromMyDevice
    })

  await handleConflictOnMove(
    client,
    newCreatedFromMyDeviceFolder.data,
    photosRootFolder,
    newNameForSavedFromMyDevice
  )

  try {
    const oldMediaFolder = await client
      .collection('io.cozy.files')
      .statByPath(photosRootPathWithoutTranslation)
    await client
      .collection('io.cozy.files')
      .removeReferencedBy(oldMediaFolder.data, [
        { _type: 'io.cozy.apps', _id: REF_PHOTOS }
      ])
  } catch (e) {
    console.log('error stat remove ref', e)
  }

  await getOrCreateFolderWithReference(client, photosRootPath, REF_PHOTOS)
}
