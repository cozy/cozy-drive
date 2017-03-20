'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { AlbumPhotos } from '../../src/containers/AlbumPhotos'

const routerObjectMock = {
  location: {
    pathname: '/mock/33dda00f0eec15bc3b3c59a615001ac8'
  },
  push: jest.fn(),
  params: {
    albumId: '33dda00f0eec15bc3b3c59a615001ac8'
  }
}

const mockAlbum = {
  _type: 'io.cozy.photos.album',
  name: 'albumTest',
  _id: '33dda00f0eec15bc3b3c59a615001ac8'
}

describe('AlbumPhotos component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <AlbumPhotos router={routerObjectMock} album={mockAlbum} />
    )
    expect(component.node).toMatchSnapshot()
  })
})
