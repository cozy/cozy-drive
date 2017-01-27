/* global describe it expect */

import { TRASH_DIR_ID } from '../../src/constants/config'

import { getVisibleFiles } from '../../src/reducers/index'

describe('index reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should not show trash directory', () => {
    expect(
      getVisibleFiles({
        folder: null,
        files: [{
          id: TRASH_DIR_ID,
          type: 'directory'
        }],
        ui: {
          isUpdating: [],
          isOpening: false,
          selected: []
        }
      })
    ).toEqual([])
  })
})
