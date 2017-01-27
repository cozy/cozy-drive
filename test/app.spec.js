'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from './lib/I18n'
import { I18n } from '../src/lib/I18n'
import { App } from '../src/components/App'

describe('App component only', () => {
  it('should be mounted correctly', () => {
    const component = shallow(
      <App t={mockT} />
    ).node
    expect(component).toMatchSnapshot()
  })
})

describe('I18n with App component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should be mounted correctly in en lang', () => {
    const component = shallow(
      <I18n lang='en'>
        <App />
      </I18n>
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be mounted correctly in fr lang', () => {
    const component = shallow(
      <I18n lang='fr'>
        <App />
      </I18n>
    ).node
    expect(component).toMatchSnapshot()
  })
})
