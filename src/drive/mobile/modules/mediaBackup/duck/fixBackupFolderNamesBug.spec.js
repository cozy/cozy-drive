import { fixMagicFolderName } from './fixBackupFolderNamesBug'
import { ROOT_DIR_ID } from 'constants/config'

jest.mock('./handleConflictOnMove', () => ({
  ...jest.requireActual('./handleConflictOnMove'),
  handleConflictOnMove: jest.fn()
}))

const statByPathSpy = jest.fn().mockName('statByPath')
const updateAttributesSpy = jest.fn().mockName('updateAttributes')
const removeReferencedBySpy = jest.fn().mockName('removeReferenceBy')
const createDirectorySpy = jest.fn().mockName('createDirectory')
const fakeClient = {
  collection: () => ({
    statByPath: statByPathSpy,
    updateAttributes: updateAttributesSpy,
    removeReferencedBy: removeReferencedBySpy,
    createDirectory: createDirectorySpy
  })
}

jest.mock('folder-references', () => ({
  ...jest.requireActual('folder-references'),
  getOrCreateFolderWithReference: jest.fn()
}))
describe('bugFix fix', () => {
  it('should fix the default scenario', async () => {
    /** 1er scénario :
     * - /Photos sans référence + /Photos/Uploadées par Cozy Photos/Photo1.jpg
     * - /media_folder/backup_folder/IMG001.jpg
     */
    const savedFromMyDeviceFolder = {
      name: 'mobile.settings.media_backup.backup_folder',
      id: 'old'
    }
    statByPathSpy
      .mockResolvedValueOnce({
        data: {
          dir_id: ROOT_DIR_ID,
          id: '1',
          path: '/Photos'
        }
      })
      .mockResolvedValueOnce({
        data: {
          dir_id: 'aaa',
          id: '2',
          path: '/Photos/Backed up from my mobile'
        },
        included: [
          {
            1: 1
          },
          { 2: 2 }
        ]
      })
      .mockResolvedValueOnce({
        data: {
          dir_id: 'aaa',
          id: '2',
          path: '/Photos/mobile.settings.media_backup.backup_folder'
        }
      })
    updateAttributesSpy.mockResolvedValueOnce({
      data: {
        id: 3
      }
    })

    await fixMagicFolderName(fakeClient, savedFromMyDeviceFolder)
    expect(statByPathSpy).toHaveBeenCalledWith('/Photos')
    expect(statByPathSpy).toHaveBeenNthCalledWith(
      2,
      '/Photos/Backed up from my mobile'
    )

    expect(updateAttributesSpy).toHaveBeenCalledWith(
      savedFromMyDeviceFolder.id,
      { name: 'Backed up from my mobile' }
    )
    expect(statByPathSpy).toHaveBeenNthCalledWith(
      3,
      '/mobile.settings.media_backup.media_folder'
    )

    expect(removeReferencedBySpy).toHaveBeenCalledWith(
      {
        dir_id: 'aaa',
        id: '2',
        path: '/Photos/mobile.settings.media_backup.backup_folder'
      },
      [{ _id: 'io.cozy.apps/photos', _type: 'io.cozy.apps' }]
    )
  })
})
