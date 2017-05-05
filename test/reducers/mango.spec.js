/* global describe it expect */

import {
  INDEX_FILES_BY_DATE_SUCCESS
} from '../../src/constants/actionTypes'

import { filesIndexByDate, albumsIndexByName } from '../../src/reducers/mango'

const mockMangoIndexByDate = {
  doctype: 'io.cozy.files',
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['class', 'metadata.datetime']
}

const mockMangoIndexAlbumsByName = {
  doctype: 'io.cozy.photos.albums',
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['name']
}

describe('Mango files index reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      filesIndexByDate(undefined, {})
    ).toEqual(null)
  })

  // if INDEX_FILES_BY_DATE_SUCCESS -> mangoIndexByDate
  it('should handle INDEX_FILES_BY_DATE_SUCCESS', () => {
    expect(
      filesIndexByDate([], {
        type: INDEX_FILES_BY_DATE_SUCCESS,
        mangoIndexByDate: mockMangoIndexByDate
      })
    ).toEqual(mockMangoIndexByDate)
  })
})

describe('Mango albums index reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      albumsIndexByName(undefined, {})
    ).toEqual(null)
  })

  // if INDEX_ALBUMS_BY_NAME_SUCCESS -> mangoIndex
  it('should handle INDEX_ALBUMS_BY_NAME_SUCCESS', () => {
    expect(
      albumsIndexByName([], {
        type: 'INDEX_ALBUMS_BY_NAME_SUCCESS',
        mangoIndex: mockMangoIndexAlbumsByName
      })
    ).toEqual(mockMangoIndexAlbumsByName)
  })
})
