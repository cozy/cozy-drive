import CozyClient from 'cozy-client'

import { setupFolderContent } from 'test/setup'
import { generateFile, getStoreStateWhenViewingFolder } from 'test/generate'

import { createFolderV2 } from './actions'

beforeEach(() => {
  const folders = Array(3)
    .fill(null)
    .map((x, i) => generateFile({ i, type: 'directory' }))
  const files = Array(3)
    .fill(null)
    .map((x, i) => generateFile({ i }))
  jest.spyOn(CozyClient.prototype, 'requestQuery').mockResolvedValue({
    data: files.concat(folders)
  })
})

afterEach(() => {
  CozyClient.prototype.requestQuery.mockRestore()
})

describe('createFolderV2', () => {
  beforeEach(() => {
    jest.spyOn(CozyClient.prototype, 'create').mockImplementation(() => {})
  })

  afterEach(() => {
    CozyClient.prototype.create.mockRestore()
  })

  it('should not be possible to create a folder with a same name of an existing folder', async () => {
    const folderId = 'folder123456'
    const { client, store } = await setupFolderContent({
      folderId,
      initialStoreState: getStoreStateWhenViewingFolder(folderId)
    })
    await expect(
      store.dispatch(createFolderV2(client, 'foobar2'))
    ).rejects.toEqual(new Error('alert.folder_name'))
  })

  it('should be possible to create a folder', async () => {
    const folderId = 'folder123456'
    const { client, store } = await setupFolderContent({
      folderId,
      initialStoreState: getStoreStateWhenViewingFolder(folderId)
    })
    await store.dispatch(createFolderV2(client, 'foobar5'))
    expect(client.create).toHaveBeenCalledWith('io.cozy.files', {
      dirId: 'folder123456',
      name: 'foobar5',
      type: 'directory'
    })
  })
})
