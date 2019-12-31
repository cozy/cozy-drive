import { getTranslateFunction } from 'drive/mobile/lib/i18n'
import {
  getReferencedFolders,
  REF_PHOTOS,
  getOrCreateFolderWithReference
} from 'folder-references'
import { CozyFile } from 'models'

export const fixMagicFolderName = async (client, savedFromMyDeviceFolder) => {
  //LET'S FIX the bug introduced in 1.18.18. Used in 1.18.24 release
  const t = getTranslateFunction()
  if (
    savedFromMyDeviceFolder.name ===
    'mobile.settings.media_backup.backup_folder'
  ) {
    const photosRootPath = `/${t('mobile.settings.media_backup.media_folder')}`
    const photosRootPathWithoutTranslation =
      '/mobile.settings.media_backup.media_folder'
    const newNameForSavedFromMyDevice = t(
      'mobile.settings.media_backup.backup_folder'
    )
    let photosRootFolder
    try {
      photosRootFolder = await client
        .collection('io.cozy.files')
        .statByPath(photosRootPath)
    } catch (e) {}
    //If `/Photos` doesn't exist, we rename folders and that it
    if (!photosRootFolder) {
      await client
        .collection('io.cozy.files')
        .updateAttributes(savedFromMyDeviceFolder.id, {
          name: newNameForSavedFromMyDevice
        })

      const photoBackupFolder = await getReferencedFolders(client, REF_PHOTOS)
      const newNamePhotoBackupFolder = t(
        'mobile.settings.media_backup.media_folder'
      )
      //If referenced folder exist, let's rename it
      if (
        photoBackupFolder &&
        photoBackupFolder[0] &&
        photoBackupFolder[0].name ===
          'mobile.settings.media_backup.media_folder'
      ) {
        await renameFolder(
          client,
          photoBackupFolder[0],
          newNamePhotoBackupFolder
        )
        //Else we check if  folder if /mobile.settings.media_backup.media_folder exist and rename it
      } else {
        try {
          const photosRootFolderWithoutTranslation = await client
            .collection('io.cozy.files')
            .statByPath(photosRootPathWithoutTranslation)
          if (
            photosRootFolderWithoutTranslation.data &&
            photosRootFolderWithoutTranslation.data.id
          ) {
            await client
              .collection('io.cozy.files')
              .updateAttributes(photosRootFolderWithoutTranslation.data.id, {
                name: newNamePhotoBackupFolder
              })
          }
        } catch (e) {
          console.log('error', e)
          //I don't know what to do here
        }
      }
    } else {
      const pathSavedFromMobileFolder = `/${t(
        'mobile.settings.media_backup.media_folder'
      )}/${t('mobile.settings.media_backup.backup_folder')}`
      let folderSyncPhoto
      try {
        folderSyncPhoto = await client
          .collection('io.cozy.files')
          .statByPath(pathSavedFromMobileFolder)
      } catch (e) {
        //
      }

      const hasAlreadyPhotoInRightFolder =
        folderSyncPhoto &&
        folderSyncPhoto.included &&
        folderSyncPhoto.included.length > 0
          ? true
          : false
      const newCreatedFromMyDeviceFolder = await client
        .collection('io.cozy.files')
        .updateAttributes(savedFromMyDeviceFolder.id, {
          name: newNameForSavedFromMyDevice
        })
      if (!hasAlreadyPhotoInRightFolder) {
        //We delete the previous folder at the right path, we rename the referenced folder
        //we move the referenced folder
        if (folderSyncPhoto) {
          await client
            .collection('io.cozy.files')
            .deleteFilePermanently(folderSyncPhoto.data.id)
        }

        try {
          await CozyFile.move(savedFromMyDeviceFolder.id, {
            folderId: photosRootFolder.data.id
          })
        } catch (e) {
          console.log('move err', e)
        }
      } else {
        try {
          await handleConflictOnMove(
            client,
            newCreatedFromMyDeviceFolder.data,
            photosRootFolder,
            newNameForSavedFromMyDevice
          )
        } catch (e) {
          console.log('e', e)
        }
      }
      //to be sure that /Photos is referenced
      if (photosRootFolder) {
        await getOrCreateFolderWithReference(
          client,
          `${photosRootPath}`,
          REF_PHOTOS
        )
        try {
          let oldphotosRootFolder = await client
            .collection('io.cozy.files')
            .statByPath('/mobile.settings.media_backup.media_folder')
          await client
            .collection('io.cozy.files')
            .destroy(oldphotosRootFolder.data)
        } catch (e) {}
      }
    }
  }
  //END OF BUG FIX
}

//Fix bug for 1.18.18 release. Used for 1.18.24 release
const generateNewFolderNameOnConflict = folderName => {
  //Check if the string ends by _1
  const regex = new RegExp('(_)([0-9]+)$')
  const matches = folderName.match(regex)
  if (matches) {
    let versionNumber = parseInt(matches[2])
    //increment versionNumber
    versionNumber++
    const newfolderName = folderName.replace(
      new RegExp('(_)([0-9]+)$'),
      `_${versionNumber}`
    )
    return newfolderName
  } else {
    return `${folderName}_1`
  }
}

const renameFolder = async (client, folderToRename, newName) => {
  try {
    return await client
      .collection('io.cozy.files')
      .updateAttributes(folderToRename.id, { name: newName })
  } catch (e) {
    if (/Conflict/.test(e.message)) {
      const newNameWithNum = generateNewFolderNameOnConflict(newName)
      return renameFolder(client, folderToRename, newNameWithNum)
    }
    throw e
  }
}

const handleConflictOnMove = async (
  client,
  savedFromMyDeviceFolder,
  photosFolder,
  newName
) => {
  try {
    return await CozyFile.move(savedFromMyDeviceFolder.id, {
      folderId: photosFolder.data.id
    })
  } catch (e) {
    if (/Conflict/.test(e.message)) {
      const newNameWithNum = generateNewFolderNameOnConflict(newName)
      const newFolder = await renameFolder(
        client,
        savedFromMyDeviceFolder,
        newNameWithNum
      )
      return handleConflictOnMove(
        client,
        newFolder,
        photosFolder,
        newNameWithNum
      )
    }
    throw e
  }
}
