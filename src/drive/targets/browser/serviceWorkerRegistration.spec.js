import { register } from './serviceWorkerRegistration'

const updateServiceWorker = jest.fn()
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: {
    register: jest.fn().mockResolvedValue({ update: updateServiceWorker })
  }
})

describe('serviceWorkerRegistration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production'
    }
    jest
      .spyOn(window, 'addEventListener')
      .mockImplementation((type, listener) => listener())
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should load and update service worker on "load" event - on production mode', async () => {
    // When
    await register()

    // Then
    expect(window.addEventListener).toHaveBeenCalledWith(
      'load',
      expect.any(Function)
    )
    expect(updateServiceWorker).toHaveBeenCalledWith()
  })
})
