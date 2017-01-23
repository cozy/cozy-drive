'use strict'

/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockT } from '../lib/I18n'
import { Empty } from '../../src/components/Empty'

describe('Empty component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed with photos text if emptyType is photos', () => {
    const component = renderer.create(
      <Empty t={mockT} emptyType='photos' />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should be displayed with albums text if emptyType is albums', () => {
    const component = renderer.create(
      <Empty t={mockT} emptyType='albums' />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
