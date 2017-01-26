'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import { Topbar } from '../../src/components/Topbar'

describe('Topbar component', () => {
  it('should be rendered correctly according the viewName', () => {
    const component = shallow(
      <Topbar t={mockT} viewName='photos' />
    ).node
    expect(component).toMatchSnapshot()
  })
})
