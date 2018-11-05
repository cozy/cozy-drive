const cozy = {
  client: {
    init: jest.fn(),
    fetchJSON: jest.fn(),
    data: {
      defineIndex: jest.fn(),
      query: jest.fn()
    }
  }
}

global.cozy = cozy

export default cozy
