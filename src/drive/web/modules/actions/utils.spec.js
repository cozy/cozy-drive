import { createMockClient } from 'cozy-client'
import { initQuery, receiveQueryResult } from 'cozy-client/dist/store'
import { generateFile } from 'test/generate'
import {
  trashFiles,
  downloadFiles,
  openFileWith,
  exportFilesNative
} from './utils'
import {
  getEncryptionKeyFromDirId,
  downloadEncryptedFile,
  decryptFileToBlob
} from 'drive/lib/encryption'
import { DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'
import { TRASH_DIR_ID } from 'drive/constants/config'
import { isMobileApp } from 'cozy-device-helper'
import {
  saveAndOpenWithCordova,
  saveFileWithCordova
} from 'cozy-client/dist/models/fsnative'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

jest.mock('drive/web/modules/navigation/AppRoute', () => ({
  routes: []
}))

jest.mock('cozy-stack-client/dist/utils', () => ({
  forceFileDownload: jest.fn()
}))

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn()
}))

jest.mock('cozy-client/dist/models/fsnative', () => ({
  ...jest.requireActual('cozy-client/dist/models/fsnative'),
  saveAndOpenWithCordova: jest.fn(),
  saveFileWithCordova: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/Alerter', () => ({
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
}))

jest.mock('drive/lib/encryption', () => ({
  ...jest.requireActual('drive/lib/encryption'),
  getEncryptionKeyFromDirId: jest.fn(),
  downloadEncryptedFile: jest.fn(),
  decryptFileToBlob: jest.fn()
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
      { file, decryptionKey: 'encryption-key' }
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

describe('openFileWith', () => {
  const mockClient = createMockClient({})
  const blobMock = jest.fn()
  const file = generateFile({ i: 0 })
  file.mime = 'text'
  const encryptedFile = { ...file, encrypted: true }
  const vaultClient = {}
  let cordovaBackup

  beforeEach(() => {
    jest.resetAllMocks()
    isMobileApp.mockReturnValue(true)

    mockClient.collection = jest.fn().mockReturnValue(mockClient)
    mockClient.fetchFileContentById = jest.fn().mockReturnValue({
      blob: blobMock
    })
    mockClient.getFileTypeFromName = jest.fn().mockReturnValue('fake-mime')

    cordovaBackup = window.cordova
    window.cordova = { plugins: { fileOpener2: {} } }
  })

  afterEach(() => {
    window.cordova = cordovaBackup
  })

  it('opens the file with cordova', async () => {
    blobMock.mockReturnValue('fake file blob')
    await openFileWith(mockClient, file)
    expect(mockClient.fetchFileContentById).toHaveBeenCalledWith(file.id)
    expect(saveAndOpenWithCordova).toHaveBeenCalledWith('fake file blob', file)
  })

  it('open an encrypted file', async () => {
    getEncryptionKeyFromDirId.mockResolvedValueOnce('encryption-key')
    decryptFileToBlob.mockResolvedValueOnce('fake file blob')
    await openFileWith(mockClient, encryptedFile, { vaultClient })
    expect(decryptFileToBlob).toHaveBeenCalledWith(
      mockClient,
      {},
      {
        file: encryptedFile,
        decryptionKey: 'encryption-key'
      }
    )
    expect(saveAndOpenWithCordova).toHaveBeenCalledWith('fake file blob', {
      ...encryptedFile,
      mime: 'fake-mime'
    })
  })

  it('errors when the plugin is not present', async () => {
    window.cordova.plugins.fileOpener2 = null

    await openFileWith(mockClient, file)
    expect(Alerter.info).toHaveBeenCalledWith('mobile.error.open_with.noapp', {
      fileMime: file.mime
    })
  })

  it('errors when it fails to download the file', async () => {
    expect.assertions(2)
    mockClient.fetchFileContentById = jest.fn().mockRejectedValue('nope')
    try {
      await openFileWith(mockClient, file)
    } catch (e) {
      expect(e).toMatch('nope')
    }
    expect(Alerter.error).toHaveBeenCalled()
  })

  it('errors when opening the filewith cordova fails', async () => {
    saveAndOpenWithCordova.mockRejectedValue('nope')
    await openFileWith(mockClient, file)

    expect(Alerter.info).toHaveBeenCalledWith('mobile.error.open_with.noapp', {
      fileMime: file.mime
    })
  })
})

describe('exportFilesNative', () => {
  const mockClient = createMockClient({})
  const files = [generateFile({ i: 0 }), generateFile({ i: 1 })]
  const encryptedFiles = files.map(file => ({
    ...file,
    encrypted: true
  }))
  const exportMock = jest.fn()
  let pluginsBackup
  const vaultClient = {}

  beforeEach(() => {
    jest.resetAllMocks()

    mockClient.collection = jest.fn().mockReturnValue(mockClient)
    mockClient.fetchFileContentById = jest.fn().mockReturnValue({
      blob: jest.fn().mockReturnValue()
    })
    saveFileWithCordova.mockReturnValue({
      nativeURL: ''
    })

    pluginsBackup = window.plugins
    window.plugins = { socialsharing: { shareWithOptions: exportMock } }
  })

  afterEach(() => {
    window.plugins = pluginsBackup
  })

  it('exports all files', async () => {
    await exportFilesNative(mockClient, files)

    files.forEach(file =>
      expect(mockClient.fetchFileContentById).toHaveBeenCalledWith(file.id)
    )
    expect(exportMock).toHaveBeenCalled()
  })

  it('exports encrypted files', async () => {
    getEncryptionKeyFromDirId.mockResolvedValueOnce('encryption-key')
    await exportFilesNative(mockClient, encryptedFiles, { vaultClient })

    encryptedFiles.forEach(file =>
      expect(decryptFileToBlob).toHaveBeenCalledWith(
        mockClient,
        {},
        {
          file,
          decryptionKey: 'encryption-key'
        }
      )
    )
    expect(exportMock).toHaveBeenCalled()
  })

  it('reports an error', async () => {
    mockClient.fetchFileContentById.mockRejectedValue('nope')
    await exportFilesNative(mockClient, files)
    expect(Alerter.error).toHaveBeenCalled()
  })
})
