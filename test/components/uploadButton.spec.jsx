'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import { UploadButton } from '../../src/components/UploadButton'

describe('UploadButton component', () => {
  it('should be rendered correctly', () => {
    const component = shallow(
      <UploadButton t={mockT} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
