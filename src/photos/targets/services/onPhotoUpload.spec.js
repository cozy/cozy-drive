import { onPhotoUpload } from './onPhotoUpload'
import { readSetting } from 'photos/ducks/clustering/settings'
import { convertDurationInMilliseconds } from 'photos/ducks/clustering/utils'
import CozyClient from 'cozy-client'

jest.mock('photos/ducks/clustering/settings', () => ({
  ...jest.requireActual('photos/ducks/clustering/settings'),
  readSetting: jest.fn()
}))
jest.mock('photos/ducks/clustering/utils', () => ({
  ...jest.requireActual('photos/ducks/clustering/utils'),
  convertDurationInMilliseconds: jest.fn()
}))

jest.mock('photos/ducks/clustering/files', () => ({
  getFilesFromDate: jest.fn().mockReturnValue([])
}))

const client = new CozyClient({})
client.save = jest.fn(doc => Promise.resolve({ data: doc }))
CozyClient.fromEnv = jest.fn().mockReturnValue(client)

describe('onPhotoUpload', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1000)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should stop if other execution is running', async () => {
    readSetting.mockReturnValueOnce({
      jobStatus: 'running',
      cozyMetadata: {
        updatedAt: 500
      }
    })
    await onPhotoUpload()
    expect(client.save).toHaveBeenCalledTimes(0)
  })

  it('Should stop if execution is postponed', async () => {
    readSetting.mockReturnValueOnce({
      jobStatus: 'postponed',
      cozyMetadata: {
        updatedAt: 500
      }
    })
    convertDurationInMilliseconds.mockReturnValueOnce(600)
    await onPhotoUpload()
    expect(client.save).toHaveBeenCalledTimes(0)
  })

  it('should continue if lock is set for too long', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 86400001) // 24h + 1
    const params = [
      {
        evaluation: { start: 0, end: 0 }
      }
    ]
    readSetting.mockReturnValueOnce({
      jobStatus: 'running',
      cozyMetadata: {
        updatedAt: 0
      },
      parameters: params
    })
    await onPhotoUpload()
    expect(client.save).toHaveBeenCalledTimes(2)
  })
})
