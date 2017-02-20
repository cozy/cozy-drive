'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Connected, { Viewer } from '../../src/containers/Viewer'

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const paramsMock = {
  photoId: '33dda00f0eec15bc3b3c59a615001ac8'
}

const storeMock = mockStore({
  photos: [
    {
      _id: '33dda00f0eec15bc3b3c59a615001ac8'
    },
    {
      _id: '33dda00f0eec15bc3b3c59a615001ac9'
    },
    {
      _id: '33dda00f0eec15bc3b3c59a615001ad0'
    }
  ],
})

describe('Viewer component', () => {
  it('should be displayed correctly with the img src computed from photoId', () => {
    const component = shallow(
      <Connected params={paramsMock} store={storeMock} />
    )
    expect(component.node).toMatchSnapshot()
  })
})
