'use strict'

/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { Photo } from '../../src/components/Photo'

const photoObject = {
  _id: '33dda00f0eec15bc3b3c59a615001ac8',
  created_at: '0001-01-01T00:00:00Z',
  name: 'MonImage.jpg',
  size: '150000',
  updated_at: '0001-01-01T00:00:00Z'
}

describe('Photo component', () => {
  it('should render correctly an image according a photo object', () => {
    const component = renderer.create(
      <Photo photo={photoObject} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
