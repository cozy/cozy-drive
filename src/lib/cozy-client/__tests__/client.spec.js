import { CozyClient } from '..'
const client = new CozyClient()

const mock = function(obj, attr) {
  beforeEach(function() {
    obj[attr] = jest.fn()
  })
  afterEach(function() {
    obj[attr].mockReset()
  })
}

describe('cozy client', function() {
  mock(client.facade.stackAdapter, 'fetchDocuments')
  mock(client.facade.pouchAdapter, 'fetchDocuments')

  it('should be possible to select the adapter when fetching', () => {
    client.fetchDocuments('rockets', 'io.cozy.rockets', { policy: 'cache' })
    expect(client.facade.pouchAdapter.fetchDocuments).toHaveBeenCalled()
    client.fetchDocuments('rockets', 'io.cozy.rockets', { policy: 'network' })
    expect(client.facade.stackAdapter.fetchDocuments).toHaveBeenCalled()
    client.fetchDocuments('rockets', 'io.cozy.rockets')
    expect(client.facade.stackAdapter.fetchDocuments).toHaveBeenCalled()
  })
})
