import localforage from 'localforage'

import migrateOfflineFiles from 'drive/targets/mobile/migrations/migrationOfflineFiles'
import { isWifi } from 'drive/mobile/lib/network'
import {
  getAvailableOfflineIds,
  saveOfflineFileCopy,
  addFileIdToLocalStorageItem,
  markAsUnavailableOffline
} from 'drive/mobile/modules/offline/duck'
import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'
import logger from 'lib/logger'

logger.error = jest.fn()

jest.mock('drive/mobile/modules/offline/duck')
jest.mock('drive/mobile/modules/mediaBackup/duck')
jest.mock('localforage')
jest.mock('drive/mobile/lib/network')
jest.mock('drive/mobile/lib/cozy-helper')

describe('migrateOfflineFiles', () => {
  let setup

  beforeEach(() => {
    getAvailableOfflineIds.mockImplementation(({ availableOffline }) => availableOffline)
    setup = async ({
         isWifiEnabled = true,
         isAlreadyMigrated = false,
         availableOfflineFileIds
       }) => {
      const alreadyMigrated = localforage.getItem.mockResolvedValueOnce
      alreadyMigrated(isAlreadyMigrated)
      isWifi.mockReturnValue(isWifiEnabled)

      const client = {
        query: jest.fn(() => ({ data: { data: { id: '123' } } })),
        store: {
          getState: jest.fn(() => ({
            availableOffline: availableOfflineFileIds
          })),
          dispatch: jest.fn()
        }
      }
      await migrateOfflineFiles(client)
      return { client }
    }
  })

  it('should migrate offline files and set information in localStorage', async () => {
    const availableOfflineFileIds = ['123', '456']
    const { client } = await setup({ availableOfflineFileIds })

    expect(localforage.getItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished'
    )
    expect(getAvailableOfflineIds).toHaveBeenCalledWith(client.store.getState())
    expect(client.store.dispatch).toHaveBeenNthCalledWith(1, cancelMediaBackup())

    for (const fileId of availableOfflineFileIds) {
      expect(client.query).toHaveBeenCalled()
      expect(saveOfflineFileCopy).toHaveBeenCalled()
      expect(addFileIdToLocalStorageItem).toHaveBeenCalledWith(
        'offlineFilesMigration-migratedFileIds',
        fileId
      )
    }

    expect(client.store.dispatch).toHaveBeenNthCalledWith(2, startMediaBackup())
    expect(localforage.setItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished',
      true
    )
  })

  it('should do nothing if not in wifi', async () => {
    const availableOfflineFileIds = ['123', '456']
    const { client } = await setup({
      isWifiEnabled: false,
      availableOfflineFileIds
    })

    expect(localforage.getItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished'
    )
    expect(getAvailableOfflineIds).not.toHaveBeenCalled()
    expect(client.store.dispatch).not.toHaveBeenCalled()

    availableOfflineFileIds.forEach(() => {
      expect(client.query).not.toHaveBeenCalled()
      expect(saveOfflineFileCopy).not.toHaveBeenCalled()
      expect(addFileIdToLocalStorageItem).not.toHaveBeenCalled()
    })

    expect(localforage.setItem).not.toHaveBeenCalledWith(
      'offlineFilesMigration-finished',
      true
    )
  })

  it('should do nothing if offline files are already migrated', async () => {
    const availableOfflineFileIds = ['123', '456']
    const { client } = await setup({
      isAlreadyMigrated: true,
      availableOfflineFileIds
    })

    expect(localforage.getItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished'
    )
    expect(getAvailableOfflineIds).not.toHaveBeenCalled()
    expect(client.store.dispatch).not.toHaveBeenCalled()

    availableOfflineFileIds.forEach(() => {
      expect(client.query).not.toHaveBeenCalled()
      expect(saveOfflineFileCopy).not.toHaveBeenCalled()
      expect(addFileIdToLocalStorageItem).not.toHaveBeenCalled()
    })

    expect(localforage.setItem).not.toHaveBeenCalledWith(
      'offlineFilesMigration-finished',
      true
    )
  })

  it('should not migates file and set migration finished if no offline file', async () => {
    const availableOfflineFileIds = []
    const { client } = await setup({
      availableOfflineFileIds
    })

    expect(localforage.getItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished'
    )
    expect(getAvailableOfflineIds).toHaveBeenCalled()
    expect(client.store.dispatch).not.toHaveBeenCalled()

    availableOfflineFileIds.forEach(() => {
      expect(client.query).not.toHaveBeenCalled()
      expect(saveOfflineFileCopy).not.toHaveBeenCalled()
      expect(addFileIdToLocalStorageItem).not.toHaveBeenCalled()
    })

    expect(localforage.setItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished',
      true
    )
  })

  it('should mark as unavailable offline, update not migrated local storage key and log error when something goes wrong on a file', async () => {
    const availableOfflineFileIds = ['123', '456']
    // simulate error when saving the first file
    saveOfflineFileCopy.mockRejectedValueOnce({
      message: 'failed to save file'
    })
    localforage.getItem.mockResolvedValue(availableOfflineFileIds)

    const { client } = await setup({
      availableOfflineFileIds
    })

    expect(client.store.dispatch).toHaveBeenNthCalledWith(1, cancelMediaBackup())

    availableOfflineFileIds.forEach((fileId, index) => {
      if (index === 0) {
        expect(client.store.dispatch).toHaveBeenNthCalledWith(
          2,
          markAsUnavailableOffline()
        )
        expect(addFileIdToLocalStorageItem).toHaveBeenCalledWith(
          'offlineFilesMigration-notMigratedFileIds',
          fileId
        )
      } else {
        expect(addFileIdToLocalStorageItem).toHaveBeenCalledWith(
          'offlineFilesMigration-migratedFileIds',
          fileId
        )
      }
    })

    expect(client.store.dispatch).toHaveBeenNthCalledWith(3, startMediaBackup())
    expect(logger.error).toHaveBeenCalledWith(
      'migrateOfflineFiles finished with error : Error: 2 of 4 files have been migrated successfully. The files with these ids have not been migrated: 123,456'
    )
    expect(localforage.setItem).toHaveBeenCalledWith(
      'offlineFilesMigration-finished',
      true
    )
  })
})
