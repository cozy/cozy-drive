/* global describe it expect */

import {
  mustShowSelectionBar
} from '../../src/reducers'

const stateWithSelectedPhotos = {
  ui: {
    selected: ['photoObject1', 'photoObject2']
  }
}

const stateWithSelectionBar = {
  ui: {
    showSelectionBar: true
  }
}

const stateShouldNotDisplaySelectionBar = {
  ui: {
    selected: []
  }
}

describe('mustShowSelectionBar helper', () => {
  it('should return true if selected photos', () => {
    expect(
      mustShowSelectionBar(stateWithSelectedPhotos)
    ).toEqual(true)
  })

  it('should return true if selectionBar enabled', () => {
    expect(
      mustShowSelectionBar(stateWithSelectionBar)
    ).toEqual(true)
  })

  it('should return false no selected photos', () => {
    expect(
      mustShowSelectionBar(stateShouldNotDisplaySelectionBar)
    ).toEqual(false)
  })
})
