/* global jest describe it expect */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  DO_INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS,
  FILE_DOCTYPE
} from '../../src/actions/constants'
import { indexFilesByDate } from '../../src/actions/mango'

import cozy from 'cozy-client-js'

const mockMangoIndexByDate = {
  doctype: 'io.cozy.files',
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['class', 'created_at']
}

jest.mock('cozy-client-js', () => {
  return {
    defineIndex: jest.fn(() => mockMangoIndexByDate)
  }
})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('indexFilesByDate', () => {
  it('should call cozy.defineIndex to create an index on fields "class" and "created_at"', () => {
    const expectedActions = [
      {
        type: DO_INDEX_FILES_BY_DATE
      },
      {
        type: INDEX_FILES_BY_DATE_SUCCESS,
        mangoIndexByDate: mockMangoIndexByDate
      }
    ]
    const store = mockStore({ })
    return store.dispatch(indexFilesByDate())
      .then(() => {
        expect(cozy.defineIndex.mock.calls.length).toBe(1)
        expect(cozy.defineIndex.mock.calls[0][0]).toBe(FILE_DOCTYPE)
        expect(cozy.defineIndex.mock.calls[0][1]).toEqual(
          [ 'class', 'created_at' ])
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
