import { combineReducers } from 'redux'
import {
  reducer as cozyReducer,
  fetchCollection,
  getCollection,
  createDocument,
  updateDocument,
  updateDocuments,
  deleteDocuments
} from '..'

const reducer = combineReducers({ cozy: cozyReducer })
const dispatchInitialAction = (compositeAction, initialState = undefined) => {
  const { types, ...rest } = compositeAction
  return reducer(initialState, { type: types[0], ...rest })
}

const dispatchSuccessfulAction = (
  compositeAction,
  response,
  initialState = undefined
) => {
  const { types, ...rest } = compositeAction
  const actions = [
    { type: types[0], ...rest },
    { type: types[1], ...rest, response }
  ]
  return actions.reduce((state, action) => reducer(state, action), initialState)
}

describe('Redux store tests', () => {
  describe('Given the store is empty', () => {
    it('should return a default state', () => {
      expect(getCollection(reducer(undefined, {}), 'rockets')).toEqual({
        type: null,
        options: {},
        fetchStatus: 'pending',
        lastFetch: null,
        hasMore: false,
        count: 0,
        ids: [],
        data: null
      })
    })

    describe('When a collection is fetched', () => {
      it('should have a `loading` status', () => {
        const state = dispatchInitialAction(
          fetchCollection('rockets', 'io.cozy.rockets')
        )
        const collection = getCollection(state, 'rockets')
        expect(collection.fetchStatus).toBe('loading')
      })
    })
  })

  const fakeFetchResponse = {
    data: [
      {
        id: '33dda00f0eec15bc3b3c59a615001ac7',
        _type: 'io.cozy.rockets',
        name: 'Falcon 9'
      },
      {
        id: '33dda00f0eec15bc3b3c59a615001ac8',
        _type: 'io.cozy.rockets',
        name: 'Falcon Heavy'
      },
      {
        id: '33dda00f0eec15bc3b3c59a615001ac9',
        _type: 'io.cozy.rockets',
        name: 'BFR'
      }
    ]
  }

  describe('Given a collection has been successfully fetched', () => {
    let state, collection

    beforeEach(() => {
      state = dispatchSuccessfulAction(
        fetchCollection('rockets', 'io.cozy.rockets'),
        fakeFetchResponse
      )
      collection = getCollection(state, 'rockets')
    })

    it('should have a `loaded` status', () => {
      expect(collection.fetchStatus).toBe('loaded')
    })

    it('should have a `data` property with the list of documents', () => {
      expect(collection.data).toEqual(fakeFetchResponse.data)
    })

    describe('When a document is successfully created on the server', () => {
      const fakeResponse = {
        data: [
          {
            id: '33dda00f0eec15bc3b3c59a615001ac5',
            _type: 'io.cozy.rockets',
            name: 'Saturn V'
          }
        ]
      }

      it('should be found in the store', () => {})

      it('should update collections listed in the `updateCollections` option', () => {
        state = dispatchSuccessfulAction(
          createDocument(
            'io.cozy.rockets',
            { name: 'Saturn V' },
            {
              updateCollections: ['rockets']
            }
          ),
          fakeResponse,
          state
        )
        collection = getCollection(state, 'rockets')
        expect(collection.data[3]).toEqual(fakeResponse.data[0])
      })
    })

    describe('When no document have been updated on the server', () => {
      const fakeResponse = { data: [] }

      it('should do nothing', () => {
        collection = getCollection(state, 'rockets')
        const before = collection.data[0]
        state = dispatchSuccessfulAction(
          updateDocument(
            'io.cozy.rockets',
            { name: 'Saturn V' },
            {
              updateCollections: ['rockets']
            }
          ),
          fakeResponse,
          state
        )
        collection = getCollection(state, 'rockets')
        expect(collection.data[0]).toEqual(before)
      })
    })

    describe('When a document is successfully updated on the server', () => {
      const fakeResponse = {
        data: [
          {
            id: '33dda00f0eec15bc3b3c59a615001ac7',
            _type: 'io.cozy.rockets',
            name: 'Falcon X'
          }
        ]
      }

      it('should update collections listed in the `updateCollections` option', () => {
        state = dispatchSuccessfulAction(
          updateDocument(
            'io.cozy.rockets',
            { name: 'Saturn V' },
            {
              updateCollections: ['rockets']
            }
          ),
          fakeResponse,
          state
        )
        collection = getCollection(state, 'rockets')
        expect(collection.data[0]).toEqual(fakeResponse.data[0])
      })
    })

    describe('When documents are successfully updated on the server', () => {
      const fakeResponse = {
        data: [
          {
            id: '33dda00f0eec15bc3b3c59a615001ac7',
            name: 'Falcon X',
            _type: 'io.cozy.rockets'
          },
          {
            id: '33dda00f0eec15bc3b3c59a615001ac8',
            name: 'Falcon Light',
            _type: 'io.cozy.rockets'
          }
        ]
      }

      it('should update collections listed in the `updateCollections` option', () => {
        state = dispatchSuccessfulAction(
          updateDocuments(
            'io.cozy.rockets',
            { selector: {} },
            {
              updateCollections: ['rockets']
            }
          ),
          fakeResponse,
          state
        )
        collection = getCollection(state, 'rockets')
        expect(collection.data[0]).toEqual(fakeResponse.data[0])
      })
    })

    describe('When no documents have been deleted on the server', () => {
      const fakeResponse = { data: [] }

      it('should do nothing', () => {
        collection = getCollection(state, 'rockets')
        const before = collection.ids
        state = dispatchSuccessfulAction(
          deleteDocuments(
            'io.cozy.rockets',
            { selector: {} },
            {
              updateCollections: ['rockets']
            }
          ),
          fakeResponse,
          state
        )
        collection = getCollection(state, 'rockets')
        expect(collection.ids).toEqual(before)
      })
    })

    describe('When documents are successfully deleted on the server', () => {
      const fakeResponse = {
        data: [
          {
            id: '33dda00f0eec15bc3b3c59a615001ac7',
            _deleted: true,
            _type: 'io.cozy.rockets'
          },
          {
            id: '33dda00f0eec15bc3b3c59a615001ac8',
            _deleted: true,
            _type: 'io.cozy.rockets'
          }
        ]
      }

      it('should update collections listed in the `updateCollections` option', () => {
        state = dispatchSuccessfulAction(
          deleteDocuments(
            'io.cozy.rockets',
            { selector: {} },
            {
              updateCollections: ['rockets']
            }
          ),
          fakeResponse,
          state
        )
        collection = getCollection(state, 'rockets')
        expect(collection.ids.length).toBe(1)
        expect(collection.ids[0]).toBe('33dda00f0eec15bc3b3c59a615001ac9')
        expect(collection.data.length).toBe(1)
        expect(collection.data[0].id).toBe('33dda00f0eec15bc3b3c59a615001ac9')
      })
    })
  })
})
