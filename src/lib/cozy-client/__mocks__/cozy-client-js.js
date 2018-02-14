const cozy = {
  client: {
    init: jest.genMockFunction(),
    fetchJSON: jest.genMockFunction(),
    data: {
      defineIndex: jest.genMockFunction(),
      query: jest.genMockFunction()
    }
  }
}

global.cozy = cozy

export default cozy
