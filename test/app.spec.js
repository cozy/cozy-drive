'use strict'

/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { I18n } from '../src/plugins/preact-polyglot'
import App from '../src/components/App'

test('Hello world', () => {
  const component = renderer.create(
    <I18n lang='en'>
      <App />
    </I18n>
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
