'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { Toolbar } from '../../src/containers/Toolbar'

describe('Toolbar component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <Toolbar t={mockT} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
