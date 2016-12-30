'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { I18n } from '../src/plugins/preact-polyglot'

import Toolbar from '../src/components/Toolbar'


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
