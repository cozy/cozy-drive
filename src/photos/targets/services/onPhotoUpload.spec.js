import { onPhotoUpload } from './onPhotoUpload'
import { readSetting } from 'photos/ducks/clustering/settings'
import {
  convertDurationInMilliseconds,
  pickInstance
} from 'photos/ducks/clustering/utils'
import CozyClient from 'cozy-client'

CozyClient.fromEnv = jest.fn()
jest.mock('photos/ducks/clustering/settings', () => ({
  readSetting: jest.fn()
}))
jest.mock('photos/ducks/clustering/utils', () => ({
  convertDurationInMilliseconds: jest.fn(),
  pickInstance: jest.fn()
}))
jest.mock('cozy-client')
const client = new CozyClient({})
client.save = jest.fn(() => Promise.resolve({ data: {} }))

describe('onPhotoUpload', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1000)
    pickInstance.mockReturnValue(true)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should stop if running', async () => {
    readSetting.mockReturnValueOnce({ jobStatus: 'running' })
    await onPhotoUpload()
    expect(client.save).toHaveBeenCalledTimes(0)
  })

  it('Should stop if postponed', async () => {
    readSetting.mockReturnValueOnce({ jobStatus: 'postponed', lastExec: 500 })
    convertDurationInMilliseconds.mockReturnValueOnce(600)
    await onPhotoUpload()
    expect(client.save).toHaveBeenCalledTimes(0)
  })
})
