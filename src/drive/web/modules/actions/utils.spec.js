import { createMockClient } from 'cozy-client'
import { initQuery, receiveQueryResult } from 'cozy-client/dist/store'
import { generateFile } from 'test/generate'
import { trashFiles, downloadFiles } from './utils'
import {
  getEncryptionKeyFromDirId,
  downloadEncryptedFile,
  decryptFile
} from 'drive/lib/encryption'
import { DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'
import { TRASH_DIR_ID } from 'constants/config'
import { saveAndOpenWithCordova } from 'cozy-client/dist/models/fsnative'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

jest.mock('drive/web/modules/navigation/AppRoute', () => ({
  routes: []
}))

jest.mock('cozy-stack-client/dist/utils', () => ({
  forceFileDownload: jest.fn()
}))

jest.mock('cozy-client/dist/models/fsnative', () => ({
  ...jest.requireActual('cozy-client/dist/models/fsnative'),
  saveAndOpenWithCordova: jest.fn(),
  saveFileWithCordova: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/deprecated/Alerter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
}))

jest.mock('drive/lib/encryption', () => ({
  ...jest.requireActual('drive/lib/encryption'),
  getEncryptionKeyFromDirId: jest.fn(),
  downloadEncryptedFile: jest.fn(),
  decryptFile: jest.fn()
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
  const mockDownload = jest.fn()
  const mockDownloadArchive = jest.fn()

  beforeEach(() => {
    mockClient.collection = () => ({
      getDownloadLinkById: mockGetDownloadLinkById,
      getArchiveLinkByIds: mockGetArchiveLinkByIds,
      download: mockDownload,
      downloadArchive: mockDownloadArchive
    })
  })

  it('downloads a single file', async () => {
    const file = {
      id: 'file-id-1',
      name: 'my-file.pdf',
      type: 'file'
    }
    await downloadFiles(mockClient, [file])
    expect(mockDownload).toHaveBeenCalledWith(file, null, file.name)
  })

  it('downloads a single encrypted file', async () => {
    const file = {
      id: 'file-id-1',
      name: 'my-file.pdf',
      type: 'file',
      encrypted: true
    }
    getEncryptionKeyFromDirId.mockResolvedValueOnce('encryption-key')
    await downloadFiles(mockClient, [file], { vaultClient: {} })
    expect(downloadEncryptedFile).toHaveBeenCalledWith(
      mockClient,
      {},
      { file, encryptionKey: 'encryption-key' }
    )
  })

  it('downloads a folder', async () => {
    const folder = {
      id: 'folder-id-1',
      name: 'Classified',
      type: 'directory'
    }
    await downloadFiles(mockClient, [folder])
    expect(mockDownloadArchive).toHaveBeenCalledWith([folder.id])
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
    await downloadFiles(mockClient, files)
    expect(mockDownloadArchive).toHaveBeenCalledWith(['file-id-1', 'file-id-2'])
  })

  it('cannot download multiple encrypted files', async () => {
    const files = [
      {
        id: 'file-id-1',
        name: 'my-encrypted-file-1.pdf',
        type: 'file'
      },
      {
        id: 'file-id-2',
        name: 'my-encrypted-file-2.pdf',
        type: 'file'
      }
    ]
    getEncryptionKeyFromDirId.mockResolvedValueOnce('encryption-key')
    await downloadFiles(mockClient, files, { vaultClient: {} })
    expect(Alerter.error).toHaveBeenCalledWith(
      'error.download_file.encryption_many'
    )
  })

  it('cannot download an encrypted folder', async () => {
    const files = [
      {
        id: 'file-id-1',
        name: 'my-file-1.pdf',
        type: 'file'
      },
      {
        id: 'folder-id-1',
        name: 'encrypted-folder',
        type: 'directory',
        referenced_by: [
          {
            id: 'encryption-key-id',
            type: DOCTYPE_FILES_ENCRYPTION
          }
        ]
      }
    ]
    getEncryptionKeyFromDirId.mockResolvedValueOnce(null)
    await downloadFiles(mockClient, files, { vaultClient: {} })
    expect(Alerter.error).toHaveBeenCalledWith(
      'error.download_file.encryption_many'
    )
  })
})
