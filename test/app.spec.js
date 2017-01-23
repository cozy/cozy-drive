'use strict'

/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockT } from './lib/I18n'
import { I18n } from '../src/lib/I18n'
import { App } from '../src/components/App'

describe('App component only', () => {
  it('should be mounted correctly', () => {
    const component = renderer.create(
      <App t={mockT} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('I18n with App component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be mounted correctly in en lang', () => {
    const component = renderer.create(
      <I18n lang='en'>
        <App />
      </I18n>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should be mounted correctly in fr lang', () => {
    const component = renderer.create(
      <I18n lang='fr'>
        <App />
      </I18n>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
