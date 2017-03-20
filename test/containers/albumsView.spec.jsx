'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { AlbumsView } from '../../src/containers/AlbumsView'

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

describe('AlbumsView component', () => {
  it('should be rendered correctly with loading view if isFetching', () => {
    const component = shallow(
      <AlbumsView fetchAlbums={() => Promise.resolve(mockAlbums)} />
    )
    expect(component.node).toMatchSnapshot()
  })

  it('should be rendered correctly with error view if error', () => {
    const component = shallow(
      <AlbumsView fetchAlbums={() => Promise.reject('Success if this error message is displayed')} />
    )
    expect(component.node).toMatchSnapshot()
  })
})
