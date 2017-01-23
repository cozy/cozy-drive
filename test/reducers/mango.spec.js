/* global describe it expect */

import { INDEX_FILES_BY_DATE_SUCCESS } from '../../src/actions/constants'

import { mangoIndexByDate } from '../../src/reducers/mango'

const mockMangoIndexByDate = {
  doctype: 'io.cozy.files',
  type: 'mango',
  name: '_design/54d3474c4efdfe10d790425525e56433857955a1',
  fields: ['class', 'created_at']
}

describe('Mango index reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      mangoIndexByDate(undefined, {})
    ).toEqual(null)
  })

  // if INDEX_FILES_BY_DATE_SUCCESS -> mangoIndexByDate
  it('should handle INDEX_FILES_BY_DATE_SUCCESS', () => {
    expect(
      mangoIndexByDate([], {
        type: INDEX_FILES_BY_DATE_SUCCESS,
        mangoIndexByDate: mockMangoIndexByDate
      })
    ).toEqual(mockMangoIndexByDate)
  })
})
