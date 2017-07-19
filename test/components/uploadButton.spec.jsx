'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { UploadButton } from '../../src/components/UploadButton'

describe('UploadButton component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <UploadButton t={mockT} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should handle onChange event', () => {
    const component = shallow(
      <UploadButton t={mockT} onUpload={() => {}} />
    )
    component.find('input').simulate('change', {target: {files: []}})
    expect(component.node).toMatchSnapshot()
  })

  it('should be rendered correctly if type is menu-item', () => {
    const component = shallow(
      <UploadButton t={mockT} type='menu-item' />
    ).node
    expect(component).toMatchSnapshot()
  })
})
