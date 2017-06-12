'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { ErrorComponent } from '../../src/components/ErrorComponent'

describe('Empty component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed with photos text if errorType is timeline_photos', () => {
    const component = shallow(
      <ErrorComponent t={mockT} errorType='timeline_photos' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with photos text if errorType is album_photos', () => {
    const component = shallow(
      <ErrorComponent t={mockT} errorType='album_photos' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be displayed with albums text if errorType is albums', () => {
    const component = shallow(
      <ErrorComponent t={mockT} errorType='albums' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should handle refresh button click', () => {
    window.location.reload = jest.fn()
    const component = shallow(
      <ErrorComponent t={mockT} errorType='albums' />
    )
    component.find("[role='button']").simulate('click')
    expect(component).toMatchSnapshot()
  })
})
