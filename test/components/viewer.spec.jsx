'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Viewer from '../../src/components/Viewer'

const paramsMock = {
  photoId: '33dda00f0eec15bc3b3c59a615001ac8'
}

describe('Viewer component', () => {
  it('should be displayed correctly with the img src computed from photoId', () => {
    const component = shallow(
      <Viewer params={paramsMock} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
