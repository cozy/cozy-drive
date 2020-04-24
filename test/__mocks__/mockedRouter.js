export const mockedRouter = {
  createHref: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  setRouteLeaveHook: jest.fn(),
  isActive: jest.fn(),
  location: {
    pathname: ''
  }
}
