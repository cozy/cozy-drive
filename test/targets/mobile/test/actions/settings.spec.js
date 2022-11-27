import { mockStore } from '../../../../helpers'
import reducer from '../../../../../src/targets/mobile/reducers/settings'
import {
  SET_URL,
  setUrl,
  setBackupImages,
  setWifiOnly,
  wrongAddressError,
  ERROR,
  wrongAddressErrorMsg
} from '../../../../../src/targets/mobile/actions/settings'
import { SET_CLIENT, setClient } from '../../../../../src/actions/settings'

describe('backup images actions creators', () => {
  it('should enable backup images', () => {
    const store = mockStore({})
    store.dispatch(setBackupImages(true))
    const state = store.getActions().reduce(reducer, store.getState())
    expect(state).toEqual({ backupImages: true })
  })

  it('should disable backup images', () => {
    const store = mockStore({})
    store.dispatch(setBackupImages(false))
    const state = store.getActions().reduce(reducer, store.getState())
    expect(state).toEqual({ backupImages: false })
  })

  it('should enable backup on wifi only', () => {
    const state = reducer({}, setWifiOnly(true))
    expect(state).toEqual({ wifiOnly: true })
  })

  it('should disable backup on wifi only', () => {
    const state = reducer({}, setWifiOnly(false))
    expect(state).toEqual({ wifiOnly: false })
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

  it('should create SET_CLIENT action', () => {
    const client = { someParameter: 'Some Value' }
    const expectedAction = { type: SET_CLIENT, client }

    expect(setClient(client)).toEqual(expectedAction)
  })
})
