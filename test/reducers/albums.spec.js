/* global describe it expect */

import {
  CREATE_ALBUM_SUCCESS,
  FETCH_ALBUMS_SUCCESS
} from '../../src/constants/actionTypes'

import { albums } from '../../src/reducers/albums'

const mockAlbum = {
  _type: 'io.cozy.photos.album',
  name: 'albumTest',
  _id: '33dda00f0eec15bc3b3c59a615001ac8'
}

const mockAlbums = [
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

describe('Albums reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      albums(undefined, {})
    ).toEqual([])
  })

  // if CREATE_ALBUM_SUCCESS -> [album]
  it('should handle CREATE_ALBUM_SUCCESS', () => {
    expect(
      albums([], {
        type: CREATE_ALBUM_SUCCESS,
        album: mockAlbum
      })
    ).toEqual([mockAlbum])
  })

  // if FETCH_ALBUMS_SUCCESS -> albums
  it('should handle FETCH_ALBUMS_SUCCESS', () => {
    expect(
      albums([], {
        type: FETCH_ALBUMS_SUCCESS,
        albums: mockAlbums
      })
    ).toEqual(mockAlbums)
  })
})
