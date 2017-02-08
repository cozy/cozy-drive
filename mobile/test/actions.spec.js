import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { mobile as reducer } from '../src/reducers/mobile'
import { SET_STATE, SET_URL, SETUP, ERROR, setUrl, OnBoardingError } from '../src/actions'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('mobile reducer', () => {
  it('should set a new state with "SET_STATE"', () => {
    const newState = reducer(undefined, { type: SET_STATE, state: { some: 'state' } })
    expect(newState).not.toBe({ some: 'state' })
    expect(newState).toEqual({ some: 'state' })
  })

  it('should set an url with "SET_URL"', () => {
    const serverUrl = 'http://localhost'
    const newState = reducer({}, { type: SET_URL, url: serverUrl })
    expect(newState).toMatchObject({ serverUrl })
  })

  it('should have no error with "SET_URL"', () => {
    const serverUrl = 'http://localhost'
    const newState = reducer({ error: 'oops' }, { type: SET_URL, url: serverUrl })
    expect(newState.error).toBeNull()
  })

  it('should set setup to true with "SETUP"', () => {
    const newState = reducer({}, { type: SETUP })
    expect(newState.isSetup).toBeTruthy()
  })

  it('should have no error with "SETUP"', () => {
    const newState = reducer({ error: 'oops' }, { type: SETUP })
    expect(newState.error).toBeNull()
  })

  it('shoud add an error with "ERROR', () => {
    const newState = reducer({}, { type: ERROR, error: 'oops' })
    expect(newState.error).toBeDefined()
  })
})

describe('actions', () => {
  it('should accept https://localhost', () => {
    const store = mockStore()

    return store.dispatch(setUrl('https://localhost'))
      .then(() => {
        expect(store.getActions()).toEqual([{ type: 'SET_URL', url: 'https://localhost' }])
      })
  })

  it('should not accept http://', () => {
    const store = mockStore()

    return store.dispatch(setUrl('http://localhost'))
      .then(() => {
      })
      .catch((err) => {
        console.log('don\'t know why err is not instanceof OnBoardingError', err instanceof OnBoardingError)
        expect(err.name).toEqual('OnBoardingError')
      })
  })

  it('should accept url without scheme://', () => {
    const store = mockStore()

    return store.dispatch(setUrl('localhost'))
      .then(() => {
        expect(store.getActions()).toEqual([{ type: 'SET_URL', url: 'https://localhost' }])
      })
  })
})
