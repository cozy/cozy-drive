import CozyClient from 'cozy-client'
import { WebVaultClient } from 'cozy-keys-lib'

import { setupFolderContent } from 'test/setup'
import { generateFile, getStoreStateWhenViewingFolder } from 'test/generate'

import { createFolder } from './actions'

const vaultClient = new WebVaultClient('http://alice.cozy.cloud')

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

describe('createFolder', () => {
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
      store.dispatch(createFolder(client, vaultClient, 'foobar2'))
    ).rejects.toEqual(new Error('alert.folder_name'))
  })

  it('should be possible to create a folder', async () => {
    const folderId = 'folder123456'
    const { client, store } = await setupFolderContent({
      folderId,
      initialStoreState: getStoreStateWhenViewingFolder(folderId)
    })
    await store.dispatch(createFolder(client, vaultClient, 'foobar5'))
    expect(client.create).toHaveBeenCalledWith('io.cozy.files', {
      dirId: 'folder123456',
      name: 'foobar5',
      type: 'directory'
    })
  })
})
