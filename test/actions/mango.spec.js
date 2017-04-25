/* eslint-env jest */
/* global cozy */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS
} from '../../src/constants/actionTypes'
import {
  FILE_DOCTYPE
} from '../../src/constants/config'
import { indexFilesByDate } from '../../src/actions/mango'

import client from 'cozy-client-js'

const mockMangoIndexByDate = {
  doctype: 'io.cozy.files',
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['class', 'trashed', 'created_at']
}

beforeAll(() => {
  cozy.client = Object.assign({}, client, {
    data: {
      defineIndex: jest.fn(() => {
        return new Promise(function (resolve, reject) {
          resolve(mockMangoIndexByDate)
        })
      })
    }
  })
})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('indexFilesByDate', () => {
  it('should call cozy.client.data.defineIndex to create an index on fields "class" and "created_at"', () => {
    const expectedActions = [
      {
        type: INDEX_FILES_BY_DATE
      },
      {
        type: INDEX_FILES_BY_DATE_SUCCESS,
        mangoIndexByDate: mockMangoIndexByDate
      }
    ]
    const store = mockStore({ })
    return store.dispatch(indexFilesByDate())
      .then(() => {
        expect(cozy.client.data.defineIndex.mock.calls.length).toBe(1)
        expect(cozy.client.data.defineIndex.mock.calls[0][0]).toBe(FILE_DOCTYPE)
        expect(cozy.client.data.defineIndex.mock.calls[0][1]).toEqual(
          [ 'class', 'trashed', 'created_at' ])
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
