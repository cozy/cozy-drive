'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Connected, { Viewer } from '../../src/containers/Viewer'

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const routerObjectMock = {
  location: {
    pathname: '/mock/33dda00f0eec15bc3b3c59a615001ac8'
  },
  push: jest.fn()
}

const paramsMock = {
  photoId: '33dda00f0eec15bc3b3c59a615001ac8'
}

const paramsMock2 = {
  photoId: '33dda00f0eec15bc3b3c59a615001ac9'
}

const paramsMock3 = {
  photoId: '33dda00f0eec15bc3b3c59a615001ad0'
}

const photosMock = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac9'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ad0'
  }
]

const storeMock = mockStore({
  photos: photosMock
})

describe('Viewer component', () => {
  it('should be displayed correctly with the img src computed from photoId using the store and the connected component (current photo is the first of the list)', () => {
    const component = shallow(
      <Connected params={paramsMock} store={storeMock} />
    )
    expect(component.node.props.current).toBe(photosMock[0]._id)
    expect(component.node.props.previous).toBe(photosMock[2]._id)
    expect(component.node.props.next).toBe(photosMock[1]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should be displayed correctly with the img src computed from photoId using the store and the connected component (current photo is the middle of the list)', () => {
    const component = shallow(
      <Connected params={paramsMock2} store={storeMock} />
    )
    expect(component.node.props.current).toBe(photosMock[1]._id)
    expect(component.node.props.previous).toBe(photosMock[0]._id)
    expect(component.node.props.next).toBe(photosMock[2]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should be displayed correctly with the img src computed from photoId using the store and the connected component (current photo is the last of the list)', () => {
    const component = shallow(
      <Connected params={paramsMock3} store={storeMock} />
    )
    expect(component.node.props.current).toBe(photosMock[2]._id)
    expect(component.node.props.previous).toBe(photosMock[1]._id)
    expect(component.node.props.next).toBe(photosMock[0]._id)
    expect(component.node).toMatchSnapshot()
  })

  it('should handle correctly onClick events for previous pictures', () => {
    const component = shallow(
      <Viewer
        current={paramsMock.photoId}
        next={1}
        previous={0}
        router={routerObjectMock}
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
        router={routerObjectMock}
      />
    )
    component.find('a').at(1).simulate('click')
    expect(component.node).toMatchSnapshot()
  })
})
