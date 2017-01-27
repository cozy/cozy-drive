'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import { Nav } from '../../src/components/Nav'

describe('Nav component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <Nav t={mockT} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
