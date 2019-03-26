import { handleDeeplink } from './handleDeepLink'
import { createMemoryHistory } from 'react-router'

describe('Handling deep links', () => {
  const store = {
    dispatch: jest.fn()
  }
  const PREVIOUS_APP_ROUTE = '/previous-app'
  let history

  beforeEach(() => {
    jest.resetAllMocks()
    history = createMemoryHistory({
      entries: [
        PREVIOUS_APP_ROUTE, // the deeplink was opened from here
        '/' // the app booted here
      ]
    })
  })

  it('should redirect to the new view', () => {
    handleDeeplink(history, store, 'cozydrive://folder')
    expect(history.getCurrentLocation().pathname).toBe('/folder')
  })

  it('going back should work', () => {
    handleDeeplink(history, store, 'cozydrive://viewer')
    expect(history.getCurrentLocation().pathname).toBe('/viewer')
    history.goBack()
    expect(history.getCurrentLocation().pathname).toBe(PREVIOUS_APP_ROUTE)
  })
})
