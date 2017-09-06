import { combineReducers } from 'redux'
import {
  reducer as cozyReducer,
  fetchCollection,
  getCollection,
  createDocument
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
        type: 'io.cozy.rockets',
        name: 'Falcon 9'
      },
      {
        id: '33dda00f0eec15bc3b3c59a615001ac8',
        type: 'io.cozy.rockets',
        name: 'Falcon Heavy'
      },
      {
        id: '33dda00f0eec15bc3b3c59a615001ac9',
        type: 'io.cozy.rockets',
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
            type: 'io.cozy.rockets',
            name: 'Saturn V'
          }
        ]
      }

      it('should be found in the store', () => {})

      it('should update collections listed in the `updateCollections` option', () => {
        state = dispatchSuccessfulAction(
          createDocument(
            { type: 'io.cozy.rockets', name: 'Saturn V' },
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
  })
})
