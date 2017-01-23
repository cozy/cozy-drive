'use strict'

/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockT } from '../lib/I18n'
import { Loading } from '../../src/components/Loading'

describe('Loading component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed with photos_indexing text if loadingType is photos_indexing', () => {
    const component = renderer.create(
      <Loading t={mockT} loadingType='photos_indexing' />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should be displayed with photos_fetching text if loadingType is photos_fetching', () => {
    const component = renderer.create(
      <Loading t={mockT} loadingType='photos_fetching' />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should be displayed with photos_upload text if loadingType is photos_upload', () => {
    const component = renderer.create(
      <Loading t={mockT} loadingType='photos_upload' />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
