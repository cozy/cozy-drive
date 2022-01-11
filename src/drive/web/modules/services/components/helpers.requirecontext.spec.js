import { createMockClient, models } from 'cozy-client'

require.context = jest.fn()
import { makeNormalizedFile, containerForTesting } from './helpers'

jest.mock('./iconsContext', () => ({ keys: undefined }))

models.note.fetchURL = jest.fn(() => 'noteUrl')
jest.spyOn(containerForTesting, 'getIconUrl').mockReturnValue('mocked')
const client = createMockClient({})

describe('makeNormalizedFile', () => {
  it('should run without', async () => {
    const folders = [{ _id: 'folderId', path: 'folderPath' }]
    const file = {
      _id: 'fileId',
      dir_id: 'folderId',
      type: 'file',
      name: 'fileName'
    }

    try {
      await makeNormalizedFile(client, folders, file)
    } catch (error) {
      throw error
    }
  })
})
