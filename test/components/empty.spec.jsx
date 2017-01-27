'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import { Empty } from '../../src/components/Empty'

describe('Empty component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed with photos text if emptyType is photos', () => {
    const component = shallow(
      <Empty t={mockT} emptyType='photos' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with albums text if emptyType is albums', () => {
    const component = shallow(
      <Empty t={mockT} emptyType='albums' />
    ).node
    expect(component).toMatchSnapshot()
  })
})
