'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { Loading } from '../../src/components/Loading'

describe('Loading component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed with photos_indexing text if loadingType is photos_indexing', () => {
    const component = shallow(
      <Loading t={mockT} loadingType='photos_indexing' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with photos_fetching text if loadingType is photos_fetching', () => {
    const component = shallow(
      <Loading t={mockT} loadingType='photos_fetching' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with photos_upload text if loadingType is photos_upload', () => {
    const component = shallow(
      <Loading t={mockT} loadingType='photos_upload' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with --no-margin class if noMargin is true', () => {
    const component = shallow(
      <Loading t={mockT} noMargin />
    ).node
    expect(component).toMatchSnapshot()
  })
})
