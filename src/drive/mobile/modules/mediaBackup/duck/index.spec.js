import { startMediaBackup } from './index'
import { createMockClient } from 'cozy-client/dist/mock'
import { isAuthorized, getPhotos } from 'drive/mobile/lib/media'
jest.mock('drive/mobile/lib/media', () => ({
  ...jest.requireActual('drive/mobile/lib/media'),
  isAuthorized: jest.fn(),
  getPhotos: jest.fn()
}))

import { setBackupImages } from 'drive/mobile/modules/settings/duck'
jest.mock('drive/mobile/modules/settings/duck', () => ({
  ...jest.requireActual('drive/mobile/modules/settings/duck'),
  setBackupImages: jest.fn()
}))

import { getUploadDir, uploadPhoto } from './files'
jest.mock('./files', () => ({
  ...jest.requireActual('./files'),
  getUploadDir: jest.fn(),
  uploadPhoto: jest.fn()
}))
import {
  MEDIA_UPLOAD_START,
  CURRENT_UPLOAD,
  MEDIA_UPLOAD_ABORT
} from './reducer'

describe('StartMediaBackup', () => {
  const client = createMockClient({})

  const mockedDispatch = jest.fn()
  const mockedGetState = jest.fn()
  const mockedState = {
    mobile: {
      settings: {
        backupImages: true,
        wifiOnly: false
      },
      mediaBackup: {
        uploaded: [1]
      }
    }
  }
  const mockedPhotoOnDevice = [
    {
      id: 2
    }
  ]
  const uploadDirIr = 'uploadId'
  const uploadDirPath = '/upload'

  beforeEach(() => {
    jest.resetAllMocks()
    getUploadDir.mockResolvedValue({
      _id: uploadDirIr,
      attributes: {
        path: uploadDirPath
      }
    })
  })
  it('starts the mediabackup with one photo to upload', async () => {
    getPhotos.mockResolvedValue(mockedPhotoOnDevice)
    mockedGetState.mockReturnValue(mockedState)
    isAuthorized.mockResolvedValue(true)
    const isManualBackup = true
    const req = startMediaBackup(isManualBackup)

    await req(mockedDispatch, mockedGetState, { client })
    expect(mockedDispatch).toHaveBeenNthCalledWith(1, {
      type: MEDIA_UPLOAD_START
    })
    expect(setBackupImages).not.toHaveBeenCalled()
    expect(mockedDispatch).toHaveBeenNthCalledWith(2, {
      type: CURRENT_UPLOAD,
      media: {
        id: 2
      },
      messageData: {
        current: 0,
        total: 1
      }
    })
    expect(uploadPhoto).toHaveBeenCalledWith(
      uploadDirPath,
      uploadDirIr,
      {
        id: 2
      },
      client
    )
    expect(client.getStackClient().fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/settings/synchronized'
    )
  })

  it('should not upload if there is nothing to upload', async () => {
    getPhotos.mockResolvedValue([])
    mockedGetState.mockReturnValue(mockedState)
    isAuthorized.mockResolvedValue(true)

    const isManualBackup = true
    const req = startMediaBackup(isManualBackup)
    await req(mockedDispatch, mockedGetState, { client })
    expect(mockedDispatch).toHaveBeenNthCalledWith(1, {
      type: MEDIA_UPLOAD_START
    })

    expect(uploadPhoto).not.toHaveBeenCalled()
    expect(client.getStackClient().fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/settings/synchonized'
    )
  })

  it('stops the backup if settings says no', async () => {
    getPhotos.mockResolvedValue([])
    mockedGetState.mockReturnValue({
      mobile: {
        settings: {
          backupImages: false,
          wifiOnly: false
        },
        mediaBackup: {
          uploaded: [1]
        }
      }
    })
    isAuthorized.mockResolvedValue(true)

    const isManualBackup = false
    const req = startMediaBackup(isManualBackup)
    await req(mockedDispatch, mockedGetState, { client })
    expect(mockedDispatch).toHaveBeenNthCalledWith(1, {
      type: MEDIA_UPLOAD_START
    })
    expect(mockedDispatch).toHaveBeenNthCalledWith(2, {
      type: MEDIA_UPLOAD_ABORT
    })
    expect(uploadPhoto).not.toHaveBeenCalled()
  })
})
