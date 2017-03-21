/* global describe it expect */

import {
  FETCH_PHOTOS,
  RECEIVE_PHOTOS,
  FETCH_PHOTOS_FAILURE,
  UPLOAD_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_FAILURE,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR,
  SELECT_PHOTO,
  UNSELECT_PHOTO,
  ADD_TO_ALBUM_SUCCESS,
  FETCH_CURRENT_ALBUM_PHOTOS,
  ADD_TO_ALBUM,
  CANCEL_ADD_TO_ALBUM
} from '../../src/constants/actionTypes'

import {
  isFetching,
  isIndexing,
  isWorking,
  showSelectionBar,
  selected,
  showAddToAlbumModal
} from '../../src/reducers/ui'

describe('UI isFetching reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      isFetching(undefined, {})
    ).toBe(false)
  })

  // if FETCH_PHOTOS -> true
  it('should handle FETCH_PHOTOS', () => {
    expect(
      isFetching([], {
        type: FETCH_PHOTOS
      })
    ).toBe(true)
  })

  // if RECEIVE_PHOTOS -> false
  it('should handle RECEIVE_PHOTOS', () => {
    expect(
      isFetching([], {
        type: RECEIVE_PHOTOS
      })
    ).toBe(false)
  })

  // if FETCH_PHOTOS_FAILURE -> false
  it('should handle FETCH_PHOTOS_FAILURE', () => {
    expect(
      isFetching([], {
        type: FETCH_PHOTOS_FAILURE
      })
    ).toBe(false)
  })
})

describe('UI isIndexing reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      isIndexing(undefined, {})
    ).toBe(false)
  })

  // if INDEX_FILES_BY_DATE -> true
  it('should handle INDEX_FILES_BY_DATE', () => {
    expect(
      isIndexing([], {
        type: INDEX_FILES_BY_DATE
      })
    ).toBe(true)
  })

  // if INDEX_FILES_BY_DATE_SUCCESS -> false
  it('should handle INDEX_FILES_BY_DATE_SUCCESS', () => {
    expect(
      isIndexing([], {
        type: INDEX_FILES_BY_DATE_SUCCESS
      })
    ).toBe(false)
  })
})

describe('UI isWorking reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      isWorking(undefined, {})
    ).toBe(false)
  })

  // if UPLOAD_PHOTOS -> true
  it('should handle UPLOAD_PHOTOS', () => {
    expect(
      isWorking([], {
        type: UPLOAD_PHOTOS
      })
    ).toBe(true)
  })

  // if UPLOAD_PHOTOS_FAILURE -> false
  it('should handle UPLOAD_PHOTOS_FAILURE', () => {
    expect(
      isWorking([], {
        type: UPLOAD_PHOTOS_FAILURE
      })
    ).toBe(false)
  })

  // if UPLOAD_PHOTOS_SUCCESS -> false
  it('should handle UPLOAD_PHOTOS_SUCCESS', () => {
    expect(
      isWorking([], {
        type: UPLOAD_PHOTOS_SUCCESS
      })
    ).toBe(false)
  })

  // if UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS -> false
  it('should handle UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS', () => {
    expect(
      isWorking([], {
        type: UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS
      })
    ).toBe(false)
  })
})

describe('UI showSelectionBar reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      showSelectionBar(undefined, {})
    ).toBe(false)
  })

  // if SHOW_SELECTION_BAR -> true
  it('should handle SHOW_SELECTION_BAR', () => {
    expect(
      showSelectionBar(false, {
        type: SHOW_SELECTION_BAR
      })
    ).toBe(true)
  })

  // if HIDE_SELECTION_BAR -> false
  it('should handle HIDE_SELECTION_BAR', () => {
    expect(
      showSelectionBar(true, {
        type: HIDE_SELECTION_BAR
      })
    ).toBe(false)
  })

  // if ADD_TO_ALBUM_SUCCESS -> false
  it('should handle ADD_TO_ALBUM_SUCCESS', () => {
    expect(
      showSelectionBar(true, {
        type: ADD_TO_ALBUM_SUCCESS
      })
    ).toBe(false)
  })
})

describe('UI selected reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      selected(undefined, {})
    ).toEqual([])
  })

  // if SELECT_PHOTO -> previous array + new selected photo id
  it('should handle SELECT_PHOTO', () => {
    expect(
      selected(['idPhoto30'], {
        type: SELECT_PHOTO,
        id: 'idPhoto42'
      })
    ).toEqual(['idPhoto30', 'idPhoto42'])
  })

  // if UNSELECT_PHOTO -> previous array - new selected photo id
  it('should handle UNSELECT_PHOTO', () => {
    expect(
      selected(['idPhoto30', 'idPhoto42'], {
        type: UNSELECT_PHOTO,
        id: 'idPhoto30'
      })
    ).toEqual(['idPhoto42'])
  })

  // if ADD_TO_ALBUM_SUCCESS / FETCH_CURRENT_ALBUM_PHOTOS / HIDE_SELECTION_BAR -> []
  it('should reset selection if ADD_TO_ALBUM_SUCCESS or FETCH_CURRENT_ALBUM_PHOTOS or HIDE_SELECTION_BAR', () => {
    expect(
      selected(['idPhoto30', 'idPhoto42'], {
        type: ADD_TO_ALBUM_SUCCESS
      })
    ).toEqual([])
    expect(
      selected(['idPhoto30', 'idPhoto42'], {
        type: FETCH_CURRENT_ALBUM_PHOTOS
      })
    ).toEqual([])
    expect(
      selected(['idPhoto30', 'idPhoto42'], {
        type: HIDE_SELECTION_BAR
      })
    ).toEqual([])
  })
})

describe('UI showAddToAlbumModal reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      showAddToAlbumModal(undefined, {})
    ).toBe(false)
  })

  // if ADD_TO_ALBUM -> true if no same named album found
  it('should handle ADD_TO_ALBUM', () => {
    expect(
      showAddToAlbumModal(false, {
        type: ADD_TO_ALBUM,
        album: undefined
      })
    ).toBe(true)
  })

  // if ADD_TO_ALBUM -> false if album with same name found
  it('should handle ADD_TO_ALBUM', () => {
    expect(
      showAddToAlbumModal(true, {
        type: ADD_TO_ALBUM,
        album: {_id: 'idAlbum42'}
      })
    ).toBe(false)
  })

  // if CANCEL_ADD_TO_ALBUM / ADD_TO_ALBUM_SUCCESS -> false
  it('should handle CANCEL_ADD_TO_ALBUM and ADD_TO_ALBUM_SUCCESS', () => {
    expect(
      showAddToAlbumModal(true, {
        type: CANCEL_ADD_TO_ALBUM
      })
    ).toBe(false)
    expect(
      showAddToAlbumModal(true, {
        type: ADD_TO_ALBUM_SUCCESS
      })
    ).toBe(false)
  })
})
