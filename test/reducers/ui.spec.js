/* global describe it expect */

import {
  FETCH_PHOTOS,
  RECEIVE_PHOTOS,
  FETCH_PHOTOS_FAILURE,
  UPLOAD_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_FAILURE,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  DO_INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS
} from '../../src/actions/constants'

import { isFetching, isIndexing, isWorking } from '../../src/reducers/ui'

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

  // if DO_INDEX_FILES_BY_DATE -> true
  it('should handle DO_INDEX_FILES_BY_DATE', () => {
    expect(
      isIndexing([], {
        type: DO_INDEX_FILES_BY_DATE
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
