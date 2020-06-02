import InitAppMobile from './InitAppMobile'
import { render } from 'react-dom'
import localforage from 'localforage'
import { hashHistory } from 'react-router'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

jest.mock('drive/mobile/lib/cozy-helper', () => {
  return {
    getLang: () => 'en',
    initClient: jest.fn(),
    registerClientPlugins: jest.fn()
  }
})
jest.mock('drive/store/configureStore')
jest.mock('drive/lib/reporter')
jest.mock(
  'drive/mobile/modules/authorization/DriveMobileRouter',
  () => () => {}
)
jest.mock('react-dom', () => {
  return {
    render: jest.fn((app, node, afterRender) => {
      afterRender()
    })
  }
})
jest.mock('localforage')
jest.mock('react-router', () => ({ hashHistory: { push: jest.fn() } }))
jest.mock('cozy-ui/transpiled/react/Alerter')
describe('App initialize', () => {
  beforeAll(() => {
    global.__DEVELOPMENT__ = false
  })

  beforeEach(() => {
    render.mockClear()
  })

  it('should start the app on device ready', async () => {
    const app = new InitAppMobile()
    const startApplicationSpy = jest.spyOn(app, 'startApplication')
    const appStarting = app.initialize()
    expect(startApplicationSpy).not.toHaveBeenCalled()
    app.onDeviceReady()
    await appStarting
    expect(startApplicationSpy).toHaveBeenCalled()
  })
  it('should inform us when the app is started', async () => {
    const app = new InitAppMobile()
    const appStarting = app.initialize()
    app.onDeviceReady()
    const result = await appStarting
    expect(result).toBe(true)
  })
  it('should not restart the app while its starting', async () => {
    const app = new InitAppMobile()
    const startApplicationSpy = jest.spyOn(app, 'startApplication')

    const appStarting = app.initialize()
    expect(startApplicationSpy).not.toHaveBeenCalled()
    app.onDeviceReady()
    expect(startApplicationSpy).not.toHaveBeenCalled()
    app.onDeviceReady()
    expect(startApplicationSpy).not.toHaveBeenCalled()

    await appStarting
    expect(startApplicationSpy).toHaveBeenCalledTimes(1)
  })
  it('should only start the app once', async () => {
    const app = new InitAppMobile()

    const appStarting = app.initialize()
    app.onDeviceReady()

    expect(render).not.toHaveBeenCalled()
    await appStarting
    expect(render).toHaveBeenCalledTimes(1)

    await app.startApplication()
    expect(render).toHaveBeenCalledTimes(1)
  })
  describe('openWith', () => {
    it('should call removeItem and not setItem when intent is empty', async () => {
      const app = new InitAppMobile()
      const intent = {}
      await app.openWithHandler(intent)
      expect(localforage.removeItem).toHaveBeenCalled()
      expect(localforage.setItem).not.toHaveBeenCalled()
    })

    it('should call setItem if there is items in intent', async () => {
      const app = new InitAppMobile()
      const intent = { items: [{ file: '1' }, { file: '2' }] }
      await app.openWithHandler(intent)

      expect(localforage.removeItem).toHaveBeenCalled()
      expect(localforage.setItem).toHaveBeenCalledWith(
        'importedFiles',
        intent.items
      )
      expect(hashHistory.push).toHaveBeenCalledWith('/uploadfrommobile')
    })
    it('should call an Alerter if something goes wrong', async () => {
      const app = new InitAppMobile()
      const intent = { items: [{ file: '1' }, { file: '2' }] }
      localforage.setItem.mockRejectedValueOnce({ message: 'error' })
      await app.openWithHandler(intent)
      expect(Alerter.error).toHaveBeenCalled()
    })
    it('should call an Alerter if we cant remove Item first time', async () => {
      const app = new InitAppMobile()
      const intent = { items: [{ file: '1' }, { file: '2' }] }
      localforage.removeItem.mockRejectedValueOnce({ message: 'error' })
      await app.openWithHandler(intent)
      expect(Alerter.error).toHaveBeenCalled()
    })
  })
})
