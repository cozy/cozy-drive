'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import AppRoute, { ComingSoon } from '../../src/components/AppRoute'

describe('AppRoute component', () => {
  it('should render the four routes: photos, albums, shared and trash', () => {
    const expectedRoutes = ['photos', 'albums', 'shared', 'trash']
    let expectedRoutesIndex = 0
    // components connected with Redux will be displayed as 'Connect(componentName)'
    const expectedComponents = ['Connect(Timeline)']
    // ComingSoon is not a component so -> not in the array
    let expectedComponentsIndex = 0

    expect(AppRoute.props.children).toBeInstanceOf(Array)
    AppRoute.props.children.forEach((element) => {
      if (element.type.displayName === 'Route') {
        expect(element.props.path).toBe(expectedRoutes[expectedRoutesIndex])
        expectedRoutesIndex++
        if (element.props.component.displayName) {
          expect(element.props.component.displayName).toBe(
            expectedComponents[expectedComponentsIndex]
          )
          expectedComponentsIndex++
        }
      }
    })
  })

  it('should temporary use a ComingSoon function as component for routes not available yet', () => {
    const comingSoonTextElement = ComingSoon()
    expect(comingSoonTextElement).toMatchSnapshot()
  })
})
