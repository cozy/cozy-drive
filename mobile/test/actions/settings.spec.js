import { mockStore } from '../../../test/helpers'
import {
  SET_URL, setUrl, checkURL,
  SET_CLIENT, setClient,
  BACKUP_IMAGES, enableBackupImages, disableBackupImages, setBackupImages,
  OnBoardingError, wrongAddressError, ERROR, wrongAddressErrorMsg
} from '../../src/actions/settings'

describe('backup images actions creators', () => {
  it('should create an action to enable backup images', () => {
    const expectedAction = { type: BACKUP_IMAGES, value: true }
    expect(enableBackupImages()).toEqual(expectedAction)
    expect(setBackupImages(true)).toEqual(expectedAction)
  })

  it('should create an action to disable backup images', () => {
    const expectedAction = { type: BACKUP_IMAGES, value: false }
    expect(disableBackupImages()).toEqual(expectedAction)
    expect(setBackupImages(false)).toEqual(expectedAction)
  })
})

describe('error actions creators', () => {
  it('should create an action to display wrong address error', () => {
    const expectedAction = { type: ERROR, error: wrongAddressErrorMsg }
    expect(wrongAddressError()).toEqual(expectedAction)
  })
})

describe('url actions creators', () => {
  it('should create an action to set server url', () => {
    const url = 'url'
    const expectedAction = { type: SET_URL, url }
    expect(setUrl(url)).toEqual(expectedAction)
  })

  it('should accept https://localhost', () => {
    const store = mockStore()

    store.dispatch(checkURL('https://localhost'))
    expect(store.getActions()).toEqual([{ type: SET_URL, url: 'https://localhost' }])
  })

  it('should not accept http://', () => {
    const store = mockStore()

    try {
      store.dispatch(checkURL('http://localhost'))
    } catch (err) {
      console.log('don\'t know why err is not instanceof OnBoardingError', err instanceof OnBoardingError)
      expect(err.name).toEqual('OnBoardingError')
    }
  })

  it('should accept url without scheme://', () => {
    const store = mockStore()

    store.dispatch(checkURL('localhost'))
    expect(store.getActions()).toEqual([{ type: SET_URL, url: 'https://localhost' }])
  })

  it('should create SET_CLIENT action', () => {
    const client = { someParameter: 'Some Value' }
    const expectedAction = { type: SET_CLIENT, client }

    expect(setClient(client)).toEqual(expectedAction)
  })
})
