'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

jest.mock('../../src/actions/photos', () => {
  return {
    getPhotoLink: () => Promise.resolve('test/monImage.jpg')
  }
})

import { mockT } from 'cozy-ui/react/I18n'
import { AlbumItem } from '../../src/components/AlbumItem'

const mockAlbum = {
  _type: 'io.cozy.photos.albums',
  name: 'albumTest2',
  _id: '33dda00f0eec15bc3b3c59a615001ac8',
  photosIds: ['f717eb4d94f07737b168d3dbb7002141']
}

const mockAlbumEmpty = {
  _type: 'io.cozy.photos.albums',
  name: 'albumTest2',
  _id: '33dda00f0eec15bc3b3c59a615001ac8',
  photosIds: []
}

const routerObjectMock = {
  location: {
    pathname: '/mock'
  }
}

describe('AlbumItem component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed correctly if album with photosIds', () => {
    const component = shallow(
      <AlbumItem t={mockT} album={mockAlbum} router={routerObjectMock} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed correctly if album without photosIds', () => {
    const component = shallow(
      <AlbumItem t={mockT} album={mockAlbumEmpty} router={routerObjectMock} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should handle onLoad img event correctly', () => {
    const component = shallow(
      <AlbumItem t={mockT} album={mockAlbum} router={routerObjectMock} />
    )
    expect(component.state().isImageLoading).toEqual(true)
    component.instance().handleImageLoaded()
    expect(component.state().isImageLoading).toEqual(false)
    expect(component.node).toMatchSnapshot()
  })
})
