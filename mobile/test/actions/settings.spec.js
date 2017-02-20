import { mockStore } from '../../../test/helpers'
import { SET_URL, checkURL, OnBoardingError } from '../../src/actions/settings'

describe('actions creators', () => {
  it('should accept https://localhost', () => {
    const store = mockStore()

    store.dispatch(checkURL('https://localhost'))
      .then(() => {
        expect(store.getActions()).toEqual([{ type: SET_URL, url: 'https://localhost' }])
      })
  })

  it('should not accept http://', () => {
    const store = mockStore()

    store.dispatch(checkURL('http://localhost'))
      .then(() => {
      })
      .catch((err) => {
        console.log('don\'t know why err is not instanceof OnBoardingError', err instanceof OnBoardingError)
        expect(err.name).toEqual('OnBoardingError')
      })
  })

  it('should accept url without scheme://', () => {
    const store = mockStore()

    store.dispatch(checkURL('localhost'))
      .then(() => {
        expect(store.getActions()).toEqual([{ type: SET_URL, url: 'https://localhost' }])
      })
  })
})
