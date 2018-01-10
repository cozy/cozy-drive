const cozy = {
  client: {
    init: jest.genMockFunction(),
    fetchJSON: jest.genMockFunction()
  }
}

global.cozy = cozy

export default cozy
