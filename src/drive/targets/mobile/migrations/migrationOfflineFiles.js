import localforage from 'localforage'

import { Q } from 'cozy-client/dist/queries/dsl'

import logger from 'lib/logger'
import {
  getAvailableOfflineIds,
  saveOfflineFileCopy,
  markAsUnavailableOffline,
  addFileIdToLocalStorageItem
} from 'drive/mobile/modules/offline/duck'
import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'
import { isWifi } from 'drive/mobile/lib/network'

const migrateOfflineFiles = async (client) => {
  try {
    const alreadyMigrated = await localforage.getItem(
      'offlineFilesMigration-finished'
    )
    if (alreadyMigrated || !isWifi()) return

    const availableOfflineIds = getAvailableOfflineIds(client.store.getState())

    if (!availableOfflineIds || availableOfflineIds.length < 1) {
      await localforage.setItem('offlineFilesMigration-finished', true)
      return
    }

    // stop media backup
    client.store.dispatch(cancelMediaBackup())

    let error = false

    for (const fileId of availableOfflineIds) {
      try {
        const { data } = await client.query(
          Q('io.cozy.files').getById(fileId)
        )
        await saveOfflineFileCopy(data, client)
        await addFileIdToLocalStorageItem(
          'offlineFilesMigration-migratedFileIds',
          fileId
        )
      } catch (e) {
        error = true
        logger.error(`migrateOfflineFiles error : ${e}`)

        client.store.dispatch(markAsUnavailableOffline(fileId))
        await addFileIdToLocalStorageItem(
          'offlineFilesMigration-notMigratedFileIds',
          fileId
        )
      }
    }

    // restart media backup
    client.store.dispatch(startMediaBackup())

    if (error) {
      const migratedFileIds =
        (await localforage.getItem(
          'offlineFilesMigration-migratedFileIds'
        )) || []
      const notMigratedFileIds =
        (await localforage.getItem(
          'offlineFilesMigration-notMigratedFileIds'
        )) || []

      throw new Error(
        `${migratedFileIds.length} of ${notMigratedFileIds.length +
          migratedFileIds.length} files have been migrated successfully. The files with these ids have not been migrated: ${notMigratedFileIds}`
      )
    }
  } catch (e) {
    logger.error(`migrateOfflineFiles finished with error : ${e}`)
  }

  await localforage.setItem('offlineFilesMigration-finished', true)
}

export default migrateOfflineFiles
