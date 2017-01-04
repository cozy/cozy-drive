'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { I18n } from '../../src/lib/I18n'

import Toolbar from '../../src/containers/Toolbar'

describe('Toolbar component', () => {
  it('Renders correctly', () => {
    const component = renderer.create(
      <I18n lang='en'>
        <Toolbar />
      </I18n>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
