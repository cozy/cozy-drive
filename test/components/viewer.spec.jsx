'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import { Viewer } from '../../src/components/Viewer'

const photoObject = {
  _id: '33dda00f0eec15bc3b3c59a615001ac8',
  created_at: '0001-01-01T00:00:00Z',
  name: 'MonImage.jpg',
  size: '150000',
  updated_at: '0001-01-01T00:00:00Z'
}

describe('Viewer component', () => {
  it('should be displayed correctly with the img src computed from photoId', () => {
    const component = shallow(
      <Viewer t={mockT} photoId={photoObject._id} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
