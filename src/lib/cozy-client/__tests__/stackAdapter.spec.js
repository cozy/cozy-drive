import cozy from 'cozy-client-js'
import CozyStackAdapter from '../adapters/CozyStackAdapter'

describe('update documents', function() {
  let adapter
  beforeEach(() => {
    adapter = new CozyStackAdapter()
    cozy.client.data.query.mockReturnValue({
      docs: [
        { _id: '33dda00f0eec15bc3b3c59a615001ac8', name: 'Falcon Heavy' },
        { _id: '33dda00f0eec15bc3b3c59a615001ac9', name: 'BFR' }
      ]
    })
  })

  it('should remove extra attributes before sending query', async () => {
    await adapter.updateDocuments('io.cozy.rockets', { selector: {} }, doc => {
      return { ...doc, power: 9001 }
    })
    expect(cozy.client.fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/data/io.cozy.rockets/_bulk_docs',
      {
        docs: [
          {
            _id: '33dda00f0eec15bc3b3c59a615001ac8',
            name: 'Falcon Heavy',
            power: 9001
          },
          { _id: '33dda00f0eec15bc3b3c59a615001ac9', name: 'BFR', power: 9001 }
        ]
      }
    )
  })

  it('should renormalize its results', async () => {
    const results = await adapter.updateDocuments(
      'io.cozy.rockets',
      { selector: {} },
      doc => {
        return { ...doc, power: 9001 }
      }
    )
    expect(results).toEqual({
      data: [
        {
          _id: '33dda00f0eec15bc3b3c59a615001ac8',
          _type: 'io.cozy.rockets',
          id: '33dda00f0eec15bc3b3c59a615001ac8',
          name: 'Falcon Heavy',
          power: 9001
        },
        {
          _id: '33dda00f0eec15bc3b3c59a615001ac9',
          _type: 'io.cozy.rockets',
          id: '33dda00f0eec15bc3b3c59a615001ac9',
          name: 'BFR',
          power: 9001
        }
      ]
    })
  })
})
