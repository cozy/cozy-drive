'use strict'

/* eslint-env jest */
// Specifying mock directly, manual mocks in __mocks__ subfolder, as described
// in https://facebook.github.io/jest/docs/manual-mocks.html seems to not
// work properly.
jest.mock('cozy-ui/react/Modal', () => {})

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { AddToAlbumModal } from '../../src/containers/AddToAlbumModal'

const mockFetchedPhotos = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8',
    metadata: {
      datetime: '0001-01-01T00:00:00Z'
    },
    name: 'MonImage.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  }
]

describe('AddToAlbumModal component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <AddToAlbumModal t={mockT} photos={mockFetchedPhotos} onDismiss={jest.fn()} onSubmitNewAlbum={jest.fn()} />
    )
    expect(component.node).toMatchSnapshot()
  })
})
