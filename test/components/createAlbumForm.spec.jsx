'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { CreateAlbumForm } from '../../src/components/CreateAlbumForm'

describe('CreateAlbumForm component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be displayed correctly', () => {
    const component = shallow(
      <CreateAlbumForm t={mockT} onSubmitNewAlbum={() => Promise.resolve()} />
    )
    expect(component.node).toMatchSnapshot()
  })

  it('should handle correctly input change', () => {
    const component = shallow(
      <CreateAlbumForm t={mockT} onSubmitNewAlbum={() => Promise.resolve()} />
    )
    component.find('[name="album-name"]').simulate('input', {target: {value: 'test'}})
    expect(component.node).toMatchSnapshot()
  })

  it('should handle correctly form submit with success', () => {
    const component = shallow(
      <CreateAlbumForm t={mockT} onSubmitNewAlbum={() => Promise.resolve()} />
    )
    component.find('[name="album-name"]').simulate('input', {target: {value: 'test'}})
    component.find('form').simulate('submit', {preventDefault: jest.fn()})
    expect(component.node).toMatchSnapshot()
  })

  it('should handle correctly form submit with error', () => {
    const component = shallow(
      <CreateAlbumForm t={mockT} onSubmitNewAlbum={() => Promise.reject()} />
    )
    component.find('[name="album-name"]').simulate('input', {target: {value: 'test'}})
    component.find('form').simulate('submit', {preventDefault: jest.fn()})
    expect(component.node).toMatchSnapshot()
  })
})
