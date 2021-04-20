import { createMockClient } from 'cozy-client'
import { forceFileDownload } from 'cozy-stack-client/dist/utils'
import { initQuery, receiveQueryResult } from 'cozy-client/dist/store'
import { generateFile } from 'test/generate'
import {
  trashFiles,
  downloadFiles,
  openFileWith,
  exportFilesNative
} from './utils'
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

describe('openFileWith', () => {
  const mockClient = createMockClient({})
  const blobMock = jest.fn()
  const file = generateFile({ i: 0 })
  file.mime = 'text'

  let cordovaBackup

  beforeEach(() => {
    jest.resetAllMocks()
    isMobileApp.mockReturnValue(true)

    mockClient.collection = jest.fn().mockReturnValue(mockClient)
    mockClient.fetchFileContentById = jest.fn().mockReturnValue({
      blob: blobMock
    })

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
  const exportMock = jest.fn()
  let pluginsBackup

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
    await exportFilesNative(mockClient, files, 'files.zip')

    files.forEach(file =>
      expect(mockClient.fetchFileContentById).toHaveBeenCalledWith(file.id)
    )
    expect(exportMock).toHaveBeenCalled()
  })

  it('reports an error', async () => {
    mockClient.fetchFileContentById.mockRejectedValue('nope')
    await exportFilesNative(mockClient, files, 'files.zip')
    expect(Alerter.error).toHaveBeenCalled()
  })
})
