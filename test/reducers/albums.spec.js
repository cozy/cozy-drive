/* global describe it expect */

import {
  CREATE_ALBUM_SUCCESS,
  FETCH_ALBUMS_SUCCESS,
  FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS
} from '../../src/constants/actionTypes'

import { albumsList, currentAlbum } from '../../src/reducers/albums'

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

describe('albumsList reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      albumsList(undefined, {})
    ).toEqual([])
  })

  // if CREATE_ALBUM_SUCCESS -> [album]
  it('should handle CREATE_ALBUM_SUCCESS', () => {
    expect(
      albumsList([], {
        type: CREATE_ALBUM_SUCCESS,
        album: mockAlbum
      })
    ).toEqual([mockAlbum])
  })

  // if FETCH_ALBUMS_SUCCESS -> albums
  it('should handle FETCH_ALBUMS_SUCCESS', () => {
    expect(
      albumsList([], {
        type: FETCH_ALBUMS_SUCCESS,
        albums: mockAlbumsList
      })
    ).toEqual(mockAlbumsList)
  })
})

describe('currentAlbum reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      currentAlbum(undefined, {})
    ).toEqual({})
  })

  // if FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS -> [album]
  it('should handle FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS', () => {
    expect(
      currentAlbum([], {
        type: FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS,
        album: mockAlbum
      })
    ).toEqual(mockAlbum)
  })
})
