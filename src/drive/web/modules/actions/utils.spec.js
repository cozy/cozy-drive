import { createMockClient } from 'cozy-client'
import { forceFileDownload } from 'cozy-stack-client/dist/utils'
import { initQuery, receiveQueryResult } from 'cozy-client/dist/store'
import { generateFile } from 'test/generate'
import { trashFiles, downloadFiles } from './utils'
import { TRASH_DIR_ID } from 'drive/constants/config'

jest.mock('drive/web/modules/navigation/AppRoute', () => ({
  routes: []
}))

jest.mock('cozy-stack-client/dist/utils', () => ({
  forceFileDownload: jest.fn()
}))

describe('trashFiles', () => {
  const setup = () => {
    const client = new createMockClient({})
    const store = client.store

    store.dispatch(
      initQuery('files', {
        doctype: 'io.cozy.files'
      })
    )

    const file = generateFile({ i: 0 })
    store.dispatch(
      receiveQueryResult('files', {
        data: file
      })
    )
    return { client, store, file }
  }
  it('should destroy the file and update queries', async () => {
    const { store, client, file } = setup()
    const mockedDestroy = jest.fn()
    client.collection = jest.fn(() => ({
      destroy: mockedDestroy
    }))

    mockedDestroy.mockResolvedValue({
      data: {
        ...file,
        dir_id: TRASH_DIR_ID
      }
    })
    const state = store.getState()

    // Make sure that the state is OK
    expect(state.cozy.documents['io.cozy.files'][file._id]._id).toEqual(
      file._id
    )

    await trashFiles(client, [file])
    expect(mockedDestroy).toHaveBeenCalledWith(file)

    const state2 = store.getState()
    const updatedFile = state2.cozy.documents['io.cozy.files'][file._id]
    expect(updatedFile.dir_id).toEqual('io.cozy.files.trash-dir')
  })
})

describe('downloadFiles', () => {
  const mockClient = createMockClient({})
  mockClient.stackClient.uri = 'http://cozy.tools'
  const mockGetDownloadLinkById = jest.fn()
  const mockGetArchiveLinkByIds = jest.fn()

  beforeEach(() => {
    mockClient.collection = () => ({
      getDownloadLinkById: mockGetDownloadLinkById,
      getArchiveLinkByIds: mockGetArchiveLinkByIds
    })
  })

  it('downloads a single file', async () => {
    const file = {
      id: 'file-id-1',
      name: 'my-file.pdf',
      type: 'file'
    }
    const fileDownloadUrl = 'http://cozy.tools/download/url'
    mockGetDownloadLinkById.mockResolvedValueOnce(fileDownloadUrl)
    await downloadFiles(mockClient, [file])

    expect(forceFileDownload).toHaveBeenCalledWith(
      `${fileDownloadUrl}?Dl=1`,
      file.name
    )
  })

  it('downloads a folder', async () => {
    const folder = {
      id: 'folder-id-1',
      name: 'Classified',
      type: 'directory'
    }
    const folderDownloadUrl = '/download/url'
    mockGetArchiveLinkByIds.mockResolvedValueOnce(folderDownloadUrl)
    await downloadFiles(mockClient, [folder])

    expect(forceFileDownload).toHaveBeenCalledWith(
      `http://cozy.tools${folderDownloadUrl}`,
      'files.zip'
    )
  })

  it('downloads multiple files', async () => {
    const files = [
      {
        id: 'file-id-1',
        name: 'my-file-1.pdf',
        type: 'file'
      },
      {
        id: 'file-id-2',
        name: 'my-file-2.pdf',
        type: 'file'
      }
    ]
    const folderDownloadUrl = '/download/url'
    mockGetArchiveLinkByIds.mockResolvedValueOnce(folderDownloadUrl)
    await downloadFiles(mockClient, files)

    expect(mockGetArchiveLinkByIds).toHaveBeenCalledWith([
      'file-id-1',
      'file-id-2'
    ])
    expect(forceFileDownload).toHaveBeenCalledWith(
      `http://cozy.tools${folderDownloadUrl}`,
      'files.zip'
    )
  })
})
