import { mockStore } from '../../../test/helpers'
import reducer from '../../src/reducers/settings'
import {
  SET_URL, setUrl, checkURL,
  setBackupImages,
  setWifiOnly,
  setAnalytics,
  OnBoardingError, wrongAddressError, ERROR, wrongAddressErrorMsg
} from '../../src/actions/settings'
import { SET_CLIENT, setClient } from '../../../src/actions/settings'

describe('backup images actions creators', () => {
  it('should enable backup images', () => {
    const store = mockStore({})
    store.dispatch(setBackupImages(true))
    const state = store.getActions().reduce(reducer, store.getState())
    expect(state).toEqual({backupImages: true})
  })

  it('should disable backup images', () => {
    const store = mockStore({})
    store.dispatch(setBackupImages(false))
    const state = store.getActions().reduce(reducer, store.getState())
    expect(state).toEqual({backupImages: false})
  })

  it('should enable backup on wifi only', () => {
    const state = reducer({}, setWifiOnly(true))
    expect(state).toEqual({wifiOnly: true})
  })

  it('should disable backup on wifi only', () => {
    const state = reducer({}, setWifiOnly(false))
    expect(state).toEqual({wifiOnly: false})
  })
})

describe('analytics actions creators', () => {
  it('should enable analytics', () => {
    const store = mockStore({})
    store.dispatch(setAnalytics(true))
    const state = store.getActions().reduce(reducer, store.getState())
    expect(state).toEqual({analytics: true})
  })

  it('should disable analytics', () => {
    const store = mockStore({})
    store.dispatch(setAnalytics(false))
    const state = store.getActions().reduce(reducer, store.getState())
    expect(state).toEqual({analytics: false})
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
