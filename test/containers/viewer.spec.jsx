'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Connected, { Viewer } from '../../src/containers/Viewer'

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const routerObjectMockForPhoto = {
  location: {
    pathname: '/photos/33dda00f0eec15bc3b3c59a615001ac8' // not used directly because params will be overwritten by paramsMock variables
  },
  push: jest.fn(),
  routes: [{path: '/'}, {path: 'photos'}]
}

const routerObjectMockForAlbumPhoto = {
  location: {
    pathname: '/albums/33dda00f0eec15bc3b3c59a615001ac8/33dda00f0eec15bc3b3c59a615001ad0'
  },
  push: jest.fn(),
  routes: [{path: '/'}, {path: 'albums'}]
}

const paramsMock = {
  photoId: '33dda00f0eec15bc3b3c59a615001ac1'
}

const paramsMock2 = {
  photoId: '33dda00f0eec15bc3b3c59a615001ac2'
}

const paramsMock3 = {
  photoId: '33dda00f0eec15bc3b3c59a615001ad3'
}

const photosMock = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac1'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac2'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ad3'
  }
]

const paramsAlbumPhotoMock = {
  photoId: '33dda00f0eec15bc3b3c59a615001AL1',
  albumId: '33dda00f0eec15bc3b3c59a615001ac8'
}

const albumPhotosMock = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001AL1'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001AL2'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001AL3'
  }
]

const storeMock = mockStore({
  photos: photosMock,
  albums: {
    currentAlbum: {
      photos: albumPhotosMock
    }
  }
})

describe('Viewer component', () => {
  it('should be displayed correctly with the img src computed from photoId using the store and the connected component (current photo is the first of the list)', () => {
    const component = shallow(
      <Connected params={paramsMock} store={storeMock} router={routerObjectMockForPhoto} />
    )
    expect(component.node.props.currentPhoto).toBe(photosMock[0])
    expect(component.node.props.previousID).toBe(photosMock[2]._id)
    expect(component.node.props.nextID).toBe(photosMock[1]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should be displayed correctly with the img src computed from photoId using the store and the connected component (current photo is the middle of the list)', () => {
    const component = shallow(
      <Connected params={paramsMock2} store={storeMock} router={routerObjectMockForPhoto} />
    )
    expect(component.node.props.currentPhoto).toBe(photosMock[1])
    expect(component.node.props.previousID).toBe(photosMock[0]._id)
    expect(component.node.props.nextID).toBe(photosMock[2]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should be displayed correctly with the img src computed from photoId using the store and the connected component (current photo is the last of the list)', () => {
    const component = shallow(
      <Connected params={paramsMock3} store={storeMock} router={routerObjectMockForPhoto} />
    )
    expect(component.node.props.currentPhoto).toBe(photosMock[2])
    expect(component.node.props.previousID).toBe(photosMock[1]._id)
    expect(component.node.props.nextID).toBe(photosMock[0]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should be displayed correctly with the img src computed from photoId using the store and the connected component for photos from an album', () => {
    const component = shallow(
      <Connected params={paramsAlbumPhotoMock} store={storeMock} router={routerObjectMockForAlbumPhoto} />
    )
    expect(component.node.props.currentPhoto).toBe(albumPhotosMock[0])
    expect(component.node.props.previousID).toBe(albumPhotosMock[2]._id)
    expect(component.node.props.nextID).toBe(albumPhotosMock[1]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should handle correctly onClick events for previous pictures', () => {
    const component = shallow(
      <Viewer
        current={paramsMock.photoId}
        next={1}
        previous={0}
        router={routerObjectMockForPhoto}
      />
    )
    component.find('a').at(0).simulate('click')
    expect(component.node).toMatchSnapshot()
  })

  it('should handle correctly onClick events for next pictures', () => {
    const component = shallow(
      <Viewer
        current={paramsMock.photoId}
        next={photosMock[1]}
        previous={photosMock[0]}
        router={routerObjectMockForPhoto}
      />
    )
    component.find('a').at(1).simulate('click')
    expect(component.node).toMatchSnapshot()
  })
})
