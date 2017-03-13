'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import { ErrorComponent } from '../../src/components/ErrorComponent'

describe('Empty component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed with photos text if errorType is photos', () => {
    const component = shallow(
      <ErrorComponent t={mockT} errorType='photos' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with albums text if errorType is albums', () => {
    const component = shallow(
      <ErrorComponent t={mockT} errorType='albums' />
    ).node
    expect(component).toMatchSnapshot()
  })
})
