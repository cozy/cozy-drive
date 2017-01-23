/* global jest describe it expect */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  FETCH_PHOTOS,
  RECEIVE_PHOTOS
} from '../../src/actions/constants'
import { fetchPhotos } from '../../src/actions/photos'

import cozy from 'cozy-client-js'

const mockFetchedPhotos = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8',
    created_at: '0001-01-01T00:00:00Z',
    name: 'MonImage.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  }
]

const mockUploadedPhoto = {
  _type: 'io.cozy.files',
  _id: 'f717eb4d94f07737b168d3dbb7002141',
  attributes: {
    type: 'file',
    name: 'MonImage.jpg',
    dir_id: 'io.cozy.files.root-dir',
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '0001-01-01T00:00:00Z',
    size: '150000',
    md5sum: 'wul1lk+i94dp3H5Dq+O54w==',
    mime: 'image/jpeg',
    class: 'image',
    executable: false,
    tags: []
  },
  _rev: '1-f796f37c53b0e3925b7104fab3935265',
  relations: () => undefined
}

jest.mock('cozy-client-js', () => {
  return {
    query: jest.fn(() => mockFetchedPhotos),
    files: {
      create: jest.fn(() => mockUploadedPhoto)
    }
  }
})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const mangoIndexByDateObject = {
  doctype: 'io.cozy.files',
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['class', 'created_at']
}

describe('fetchPhotos', () => {
  it('should call cozy.query to fetch 1 photo with success', () => {
    const expectedActions = [
      {
        type: FETCH_PHOTOS,
        mangoIndexByDate: mangoIndexByDateObject
      },
      {
        type: RECEIVE_PHOTOS,
        photos: mockFetchedPhotos
      }
    ]
    const store = mockStore({ })
    return store.dispatch(fetchPhotos(mangoIndexByDateObject))
      .then(() => {
        expect(cozy.query.mock.calls.length).toBe(1)
        expect(cozy.query.mock.calls[0][0]).toBe(mangoIndexByDateObject)
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
