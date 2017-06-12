'use strict'

/* eslint-env jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockT } from 'cozy-ui/react/I18n'
import Alerter from '../../src/components/Alerter'

jest.useFakeTimers()

describe('Alerter component', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllTimers()
  })

  it('should be usable without translating t props', () => {
    const component = renderer.create(
      <Alerter />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should display correctly a success, error and an info message', () => {
    const component = renderer.create(
      <Alerter />
    )

    Alerter.success('test success message')
    Alerter.error('test error message')
    Alerter.info('test info message')
    // run delayed features (hiddin alerts)
    jest.runAllTimers()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should display correctly a message with a button', () => {
    const component = renderer.create(
      <Alerter />
    )

    Alerter.success('test success message', { buttonText: 'Click me' })
    Alerter.info('test error message', { buttonText: 'Click me' })
    Alerter.error('test info message', { buttonText: 'Click me' })
    // run delayed features (hiddin alerts)
    jest.runAllTimers()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should be usable with translating t props', () => {
    const component = renderer.create(
      <Alerter t={mockT} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should display correctly a success, error and an info translated message', () => {
    const component = renderer.create(
      <Alerter t={mockT} />
    )

    Alerter.success('Nav.photos')
    Alerter.error('Nav.photos')
    Alerter.info('Nav.photos')
    // run delayed features (hiddin alerts)
    jest.runAllTimers()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
