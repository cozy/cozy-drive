'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { I18n } from '../src/I18n'
import { Layout } from '../src/components/Layout'

describe('App component only', () => {
  it('should be mounted correctly', () => {
    const component = shallow(
      <Layout t={mockT} />
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
        <Layout />
      </I18n>
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be mounted correctly in fr lang', () => {
    const component = shallow(
      <I18n lang='fr'>
        <Layout />
      </I18n>
    ).node
    expect(component).toMatchSnapshot()
  })
})
