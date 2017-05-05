/* eslint-env jest */
/* global cozy */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  ALBUM_DOCTYPE
} from '../../src/constants/config'

import reducer, {
  throwServerError,
  createAlbumMangoIndex,
  cancelAddToAlbum,
  checkExistingAlbumsByName,
  addToAlbum,
  createAlbum,
  fetchAlbums,
  fetchAlbumPhotosStatsById,
  getCurrentAlbum,
  getAlbumsList
} from '../../src/ducks/albums'

import client from 'cozy-client-js'

const mockMangoIndexAlbumsByName = {
  doctype: ALBUM_DOCTYPE,
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['name']
}

const mockAlbum = {
  _type: 'io.cozy.photos.album',
  name: 'albumTest',
  _id: '33dda00f0eec15bc3b3c59a615001ac8'
}

const mockAlbumsList = [
  {
    _type: 'io.cozy.photos.albums',
    name: 'albumTest2',
    _id: '33dda00f0eec15bc3b3c59a615001ac8'
  },
  {
    _type: 'io.cozy.photos.albums',
    name: 'albumTest2',
    _id: 'f717eb4d94f07737b168d3dbb7002141'
  }
]

const mockAlbumsListWithoutIds = [
  {
    _type: 'io.cozy.photos.albums',
    name: 'albumTest2',
    _id: '33dda00f0eec15bc3b3c59a615001ac8'
  },
  {
    _type: 'io.cozy.photos.albums',
    name: 'albumTest2',
    _id: 'f717eb4d94f07737b168d3dbb7002141'
  }
]

const referencedIds1 = ['33dda00f0eec15bc3b3c59a615001ac8', '33dda00f0eec15bc3b3c59a615001ac9']
const referencedIds2 = ['33dda00f0eec15bc3b3c59a615001ac0']

const mockAlbumsListWithIds = [
  Object.assign({}, mockAlbumsListWithoutIds[0], {photosIds: referencedIds1}),
  Object.assign({}, mockAlbumsListWithoutIds[1], {photosIds: referencedIds2})
]

const mockPhotosList = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8',
    metadata: {
      datetime: '0001-01-01T00:00:00Z'
    },
    name: 'MonImage.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac9',
    metadata: {
      datetime: '0001-03-01T00:00:00Z'
    },
    name: 'MonImage2_february.jpg',
    size: '120000',
    updated_at: '0001-03-01T00:00:00Z'
  }
]

const mockAlbumWithPhotos = Object.assign({}, mockAlbum, {photos: mockPhotosList})

const mockErrorsResponses = {
  unexpected: 'An unexpected error occured.',
  indexError: {
    status: 500,
    response: {
      statusText: 'Error during index creation'
    }
  },
  queryError: {
    status: 500,
    response: {
      statusText: 'Error during album fetching'
    }
  },
  addReferencedFilesError: {
    status: 500,
    response: {
      statusText: 'Error during files referencing'
    }
  },
  createError: {
    status: 500,
    response: {
      statusText: 'Error during document creation'
    }
  },
  fetchAlbumsError: {
    status: 500,
    response: {
      statusText: 'Error during albums fetching'
    }
  },
  listReferencedFilesError: {
    status: 500,
    response: {
      statusText: 'Error during referenced files fetching'
    }
  },
  findError: {
    status: 500,
    response: {
      status: 'Error during album finding'
    }
  }
}

beforeAll(() => {
  cozy.client = Object.assign({}, client, {
    data: {
      // DEFINE INDEX
      defineIndex: jest.fn(() => Promise.resolve(mockMangoIndexAlbumsByName))
      // for createAlbumMangoIndex
      .mockImplementationOnce(() => Promise.resolve(mockMangoIndexAlbumsByName))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.indexError))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.unexpected)),
      // QUERY
      query: jest.fn(() => Promise.resolve([mockAlbum]))
      // for checkExistingAlbumsByName
      .mockImplementationOnce(() => Promise.resolve([mockAlbum]))
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.queryError))
      // for createAlbum
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([]))
      // for fetchAlbums
      .mockImplementationOnce(() => Promise.resolve(mockAlbumsListWithoutIds))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.fetchAlbumsError))
      .mockImplementationOnce(() => Promise.resolve(mockAlbumsListWithoutIds)),
      // ADD REFERENCED FILES
      addReferencedFiles: jest.fn(() => Promise.resolve())
      .mockImplementationOnce(() => Promise.resolve())
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.addReferencedFilesError)),
      // CREATE
      create: jest.fn(() => Promise.resolve(mockAlbum))
      // for createAlbum
      .mockImplementationOnce(() => Promise.resolve(mockAlbum))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.createError)),
      // LIST REFERENCED FILES
      // for fetchAlbums
      listReferencedFiles: jest.fn(() => Promise.resolve(referencedIds1))
      .mockImplementationOnce(() => Promise.resolve(referencedIds1))
      .mockImplementationOnce(() => Promise.resolve(referencedIds2))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.listReferencedFilesError))
      // for fetchAlbumPhotosStatsById
      .mockImplementationOnce(() => Promise.resolve(referencedIds1)),
      // FIND
      find: jest.fn(() => Promise.resolve(mockAlbum))
      // for fetchAlbumPhotosStatsById
      .mockImplementationOnce(() => Promise.resolve(mockAlbum))
      .mockImplementationOnce(() => Promise.reject(mockErrorsResponses.findError))
    },
    files: {
      // STAT BY ID
      statById: jest.fn(() => Promise.resolve(mockPhotosList[0]))
      // for fetchAlbumPhotosStatsById
      .mockImplementationOnce(() => Promise.resolve(mockPhotosList[0]))
      .mockImplementationOnce(() => Promise.resolve(mockPhotosList[1]))
    }
  })
})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('throwServerError helper', () => {
  it('should throw correctly provided server error', () => {
    expect(() => {
      throwServerError(mockErrorsResponses.indexError)
    }).toThrow(new Error(mockErrorsResponses.indexError.response.statusText))
  })

  it('should throw correctly error object', () => {
    expect(() => {
      throwServerError(new Error(mockErrorsResponses.unexpected))
    }).toThrow(mockErrorsResponses.unexpected)
  })
})

describe('cancelAddToAlbum', () => {
  it('should dispatch CANCEL_ADD_TO_ALBUM action', () => {
    const expectedActions = [
      {
        type: 'CANCEL_ADD_TO_ALBUM',
        photos: mockPhotosList
      }
    ]
    const store = mockStore({ })
    return store.dispatch(cancelAddToAlbum(mockPhotosList))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})

describe('createAlbumMangoIndex', () => {
  beforeEach(() => {
    cozy.client.data.defineIndex.mockClear()
  })

  it('should call cozy.client.data.defineIndex to create an albums index on fields "name"', () => {
    const expectedActions = [
      {
        type: 'INDEX_ALBUMS_BY_NAME_SUCCESS',
        mangoIndex: mockMangoIndexAlbumsByName
      }
    ]
    const store = mockStore({ })
    return store.dispatch(createAlbumMangoIndex())
      .then(() => {
        expect(cozy.client.data.defineIndex.mock.calls.length).toBe(1)
        expect(cozy.client.data.defineIndex.mock.calls[0][0]).toBe(ALBUM_DOCTYPE)
        expect(cozy.client.data.defineIndex.mock.calls[0][1]).toEqual(
          [ 'name' ])
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should catch error if indexing failed', () => {
    const store = mockStore({ })
    return store.dispatch(createAlbumMangoIndex())
      .catch((fetchError) => {
        expect(cozy.client.data.defineIndex.mock.calls.length).toBe(1)
        expect(cozy.client.data.defineIndex.mock.calls[0][0]).toBe(ALBUM_DOCTYPE)
        expect(cozy.client.data.defineIndex.mock.calls[0][1]).toEqual(
          [ 'name' ])
        expect(fetchError).toEqual(new Error(mockErrorsResponses.indexError.response.statusText))
      })
  })

  it('should catch error if indexing failed with unexpected error', () => {
    const store = mockStore({ })
    return store.dispatch(createAlbumMangoIndex())
      .catch((fetchError) => {
        expect(cozy.client.data.defineIndex.mock.calls.length).toBe(1)
        expect(cozy.client.data.defineIndex.mock.calls[0][0]).toBe(ALBUM_DOCTYPE)
        expect(cozy.client.data.defineIndex.mock.calls[0][1]).toEqual(
          [ 'name' ])
        expect(fetchError).toEqual(new Error(mockErrorsResponses.unexpected))
      })
  })
})

describe('checkExistingAlbumsByName', () => {
  beforeEach(() => {
    cozy.client.data.query.mockClear()
  })

  it('should correctly query albums if mangoIndex provided and albums with same name found', () => {
    const store = mockStore({ })
    return store.dispatch(checkExistingAlbumsByName('testAlbum', mockMangoIndexAlbumsByName))
      .then((albums) => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
          { selector: {name: 'testAlbum'}, fields: ['_id'] })
        expect(albums).toEqual([mockAlbum])
      })
  })
  it('should correctly query empty list if mangoIndex provided and albums with same name not found', () => {
    const store = mockStore({ })
    return store.dispatch(checkExistingAlbumsByName('testAlbumNotFound', mockMangoIndexAlbumsByName))
      .then((albums) => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
          { selector: {name: 'testAlbumNotFound'}, fields: ['_id'] })
        expect(albums).toEqual([])
      })
  })
  it('should handle server error', () => {
    const store = mockStore({ })
    return store.dispatch(checkExistingAlbumsByName('testAlbumError', mockMangoIndexAlbumsByName))
      .catch((queryError) => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
          { selector: {name: 'testAlbumError'}, fields: ['_id'] })
        expect(queryError).toEqual(new Error(mockErrorsResponses.queryError.response.statusText))
      })
  })
})

describe('addToAlbum', () => {
  beforeEach(() => {
    cozy.client.data.addReferencedFiles.mockClear()
  })

  it('should correctly add referenced files to the album', () => {
    const expectedActions = [
      {
        type: 'ADD_TO_ALBUM_SUCCESS',
        album: mockAlbum
      }
    ]
    const store = mockStore({ })
    return store.dispatch(addToAlbum(mockPhotosList, mockAlbum))
      .then((album) => {
        expect(cozy.client.data.addReferencedFiles.mock.calls.length).toBe(1)
        expect(cozy.client.data.addReferencedFiles.mock.calls[0][0]).toEqual(mockAlbum)
        expect(cozy.client.data.addReferencedFiles.mock.calls[0][1]).toEqual(mockPhotosList)
        expect(store.getActions()).toEqual(expectedActions)
        expect(album).toEqual(mockAlbum)
      })
  })
  it('should correctly dispatch an action to open modal to create a new album if no album provided (should not call cozy-client-js here)', () => {
    const expectedActions = [
      {
        type: 'ADD_TO_ALBUM',
        photos: mockPhotosList
      }
    ]
    const store = mockStore({ })
    return store.dispatch(addToAlbum(mockPhotosList))
      .then(() => {
        expect(cozy.client.data.addReferencedFiles.mock.calls.length).toBe(0)
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
  it('should handle server error', () => {
    const store = mockStore({ })
    return store.dispatch(addToAlbum(mockPhotosList, mockAlbum))
      .catch((addReferencedFilesError) => {
        expect(cozy.client.data.addReferencedFiles.mock.calls.length).toBe(1)
        expect(cozy.client.data.addReferencedFiles.mock.calls[0][0]).toEqual(mockAlbum)
        expect(cozy.client.data.addReferencedFiles.mock.calls[0][1]).toEqual(mockPhotosList)
        expect(addReferencedFilesError).toEqual(new Error(mockErrorsResponses.addReferencedFilesError.response.statusText))
      })
  })
})

describe('createAlbum', () => {
  beforeEach(() => {
    cozy.client.data.create.mockClear()
    cozy.client.data.query.mockClear()
  })

  it('should create correctly and album with photos if all arguments provided', () => {
    const expectedActions = [
      {
        type: 'CREATE_ALBUM_SUCCESS',
        album: mockAlbum
      }
    ]
    const store = mockStore({ })
    return store.dispatch(createAlbum('testAlbum', mockMangoIndexAlbumsByName, mockPhotosList))
      .then((album) => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
        { selector: {name: 'testAlbum'}, fields: ['_id'] })
        expect(cozy.client.data.create.mock.calls.length).toBe(1)
        expect(cozy.client.data.create.mock.calls[0][0]).toEqual(ALBUM_DOCTYPE)
        expect(cozy.client.data.create.mock.calls[0][1]).toEqual(
          {name: 'testAlbum'})
        expect(album).toEqual(mockAlbum)
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should handle server error when all arguments provided', () => {
    const store = mockStore({ })
    return store.dispatch(createAlbum('testAlbumError', mockMangoIndexAlbumsByName, mockPhotosList))
      .catch((createError) => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
        { selector: {name: 'testAlbumError'}, fields: ['_id'] })
        expect(cozy.client.data.create.mock.calls.length).toBe(1)
        expect(cozy.client.data.create.mock.calls[0][0]).toEqual(ALBUM_DOCTYPE)
        expect(cozy.client.data.create.mock.calls[0][1]).toEqual(
          {name: 'testAlbumError'})
        expect(createError).toEqual(new Error(mockErrorsResponses.createError.response.statusText))
      })
  })
})

describe('fetchAlbums', () => {
  beforeEach(() => {
    cozy.client.data.listReferencedFiles.mockClear()
    cozy.client.data.query.mockClear()
  })

  it('should correctly return a list of album if index provided', () => {
    const expectedActions = [
      {
        type: 'FETCH_ALBUMS_SUCCESS',
        albums: mockAlbumsListWithIds
      }
    ]
    const store = mockStore({ })
    return store.dispatch(fetchAlbums(mockMangoIndexAlbumsByName))
      .then(() => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
        { selector: {'name': {'$gt': null}}, fields: ['_id', '_type', 'name'] })
        // for each albums, referenced files are fetched
        expect(cozy.client.data.listReferencedFiles.mock.calls.length).toBe(mockAlbumsListWithoutIds.length)
        cozy.client.data.listReferencedFiles.mock.calls.forEach((call, idx) => {
          expect(call[0]).toEqual(mockAlbumsListWithIds[idx])
        })
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should handle error if no index provided', () => {
    const store = mockStore({ })
    return store.dispatch(fetchAlbums())
      .catch(fetchError => {
        expect(fetchError).toEqual(new Error('Albums.fetchAlbums.error.index_missing'))
      })
  })

  it('should handle server error during albums querying', () => {
    const store = mockStore({ })
    return store.dispatch(fetchAlbums(mockMangoIndexAlbumsByName))
      .catch(fetchError => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
        { selector: {'name': {'$gt': null}}, fields: ['_id', '_type', 'name'] })
        // for each albums, referenced files are fetched
        expect(cozy.client.data.listReferencedFiles.mock.calls.length).toBe(0)
        expect(fetchError).toEqual(new Error(mockErrorsResponses.fetchAlbumsError.response.statusText))
      })
  })

  it('should handle server error during album referenced files listing', () => {
    const store = mockStore({ })
    return store.dispatch(fetchAlbums(mockMangoIndexAlbumsByName))
      .catch(fetchError => {
        expect(cozy.client.data.query.mock.calls.length).toBe(1)
        expect(cozy.client.data.query.mock.calls[0][0]).toEqual(mockMangoIndexAlbumsByName)
        expect(cozy.client.data.query.mock.calls[0][1]).toEqual(
        { selector: {'name': {'$gt': null}}, fields: ['_id', '_type', 'name'] })
        // for each albums, referenced files are fetched
        expect(cozy.client.data.listReferencedFiles.mock.calls.length).toBe(1)
        expect(cozy.client.data.listReferencedFiles.mock.calls[0][0]).toEqual(mockAlbumsListWithoutIds[0])
        expect(fetchError).toEqual(new Error(mockErrorsResponses.listReferencedFilesError.response.statusText))
      })
  })
})

describe('fetchAlbumPhotosStatsById', () => {
  beforeEach(() => {
    cozy.client.data.listReferencedFiles.mockClear()
    cozy.client.data.find.mockClear()
    cozy.client.files.statById.mockClear()
  })

  it('should correctly return all photos according to a album ID', () => {
    const expectedActions = [
      {
        type: 'FETCH_CURRENT_ALBUM_PHOTOS'
      },
      {
        type: 'FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS',
        album: mockAlbumWithPhotos
      }
    ]
    const store = mockStore({ })
    return store.dispatch(fetchAlbumPhotosStatsById('idAlbum42'))
      .then(albumPhotos => {
        expect(cozy.client.data.find.mock.calls.length).toBe(1)
        expect(cozy.client.data.find.mock.calls[0][0]).toEqual(ALBUM_DOCTYPE)
        expect(cozy.client.data.find.mock.calls[0][1]).toEqual('idAlbum42')
        expect(cozy.client.data.listReferencedFiles.mock.calls.length).toBe(1)
        expect(cozy.client.data.listReferencedFiles.mock.calls[0][0]).toEqual(mockAlbum)
        expect(cozy.client.files.statById.mock.calls.length).toBe(referencedIds1.length)
        cozy.client.files.statById.mock.calls.forEach((call, idx) => {
          expect(call[0]).toBe(referencedIds1[idx])
        })
        expect(albumPhotos).toEqual(mockAlbumWithPhotos.photos)
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should handle server error while finding album', () => {
    const expectedActions = [
      {
        type: 'FETCH_CURRENT_ALBUM_PHOTOS'
      }
    ]
    const store = mockStore({ })
    return store.dispatch(fetchAlbumPhotosStatsById('idAlbum42Error'))
      .catch(fetchError => {
        expect(cozy.client.data.find.mock.calls.length).toBe(1)
        expect(cozy.client.data.find.mock.calls[0][0]).toEqual(ALBUM_DOCTYPE)
        expect(cozy.client.data.find.mock.calls[0][1]).toEqual('idAlbum42Error')
        expect(cozy.client.data.listReferencedFiles.mock.calls.length).toBe(0)
        expect(cozy.client.files.statById.mock.calls.length).toBe(0)
        expect(store.getActions()).toEqual(expectedActions)
        expect(fetchError).toEqual(new Error(mockErrorsResponses.findError.response.statusText))
      })
  })
})

describe('albumsList reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      getAlbumsList(reducer(undefined, {}))
    ).toEqual([])
  })

  // if CREATE_ALBUM_SUCCESS -> [album]
  it('should handle CREATE_ALBUM_SUCCESS', () => {
    expect(
      getAlbumsList(reducer([], {
        type: 'CREATE_ALBUM_SUCCESS',
        album: mockAlbum
      }))
    ).toEqual([mockAlbum])
  })

  // if FETCH_ALBUMS_SUCCESS -> albums
  it('should handle FETCH_ALBUMS_SUCCESS', () => {
    expect(
      getAlbumsList(reducer([], {
        type: 'FETCH_ALBUMS_SUCCESS',
        albums: mockAlbumsList
      }))
    ).toEqual(mockAlbumsList)
  })
})

describe('currentAlbum reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      getCurrentAlbum(reducer(undefined, {}))
    ).toEqual({})
  })

  // if FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS -> [album]
  it('should handle FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS', () => {
    expect(
      getCurrentAlbum(reducer([], {
        type: 'FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS',
        album: mockAlbum
      }))
    ).toEqual(mockAlbum)
  })
})
