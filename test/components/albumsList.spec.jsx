'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT, mockF } from 'cozy-ui/react/I18n'
import AlbumsList from '../../src/components/AlbumsList'

const mockAlbums = [
  {
    _type: 'io.cozy.photos.albums',
    name: 'albumTest2',
    _id: '33dda00f0eec15bc3b3c59a615001ac8'
  },
  {
    _type: 'io.cozy.photos.albums',
    name: 'albumTest2',
    _id: 'f717eb4d94f07737b168d3dbb7002141'
  }
]

describe('AlbumsList component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed correctly if albums', () => {
    const component = shallow(
      <AlbumsList t={mockT} f={mockF} albums={mockAlbums} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should display empty component if albums list empty', () => {
    const component = shallow(
      <AlbumsList t={mockT} f={mockF} albums={[]} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
