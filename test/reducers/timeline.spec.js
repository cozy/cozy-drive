/* global describe it expect */

import {
  RECEIVE_PHOTOS
} from '../../src/constants/actionTypes'

import { isFirstFetch } from '../../src/reducers/timeline'

describe('Timeline reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      isFirstFetch(undefined, {})
    ).toBe(true)
  })

  // if RECEIVE_PHOTOS -> false
  it('should handle RECEIVE_PHOTOS', () => {
    expect(
      isFirstFetch([], {
        type: RECEIVE_PHOTOS
      })
    ).toBe(false)
  })
})
