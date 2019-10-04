import InitAppMobile from './InitAppMobile'
import { render } from 'react-dom'

jest.mock('drive/mobile/lib/cozy-helper')
jest.mock('drive/store/configureStore')
jest.mock('drive/lib/reporter')
jest.mock('cozy-ui/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))
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
})
