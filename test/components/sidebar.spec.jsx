'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Sidebar from '../../src/components/Sidebar'

describe('Sidebar component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <Sidebar />
    ).node
    expect(component).toMatchSnapshot()
  })
})
