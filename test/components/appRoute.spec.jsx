'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import AppRoute, { ComingSoon } from '../../src/components/AppRoute'

describe('AppRoute component', () => {
  it('should render all the routes correctly with their components', () => {
    expect(AppRoute.props.children).toBeInstanceOf(Array)

    /* test all routes and nested routes */
    // components connected with Redux will be displayed as 'Connect(componentName)'
    // ComingSoon is not a component so -> not defined
    // translated component will be display as '_translate'
    const expectedStructure = {
      photos: {
        path: 'photos',
        component: 'Connect(Timeline)',
        routes: { // nested
          ':photoId': {
            path: ':photoId',
            component: 'Connect(withRouter(Viewer))'
          }
        }
      },
      albums: {
        path: 'albums'
      },
      shared: {
        path: 'shared'
      },
      trash: {
        path: 'trash'
      }
    }

    const checkRoute = (element, expectedStructure) => {
      if (element.type.displayName === 'Route') { // if Route component
        expect(element.props.path).toBe(
          expectedStructure[element.props.path].path
        )

        if (element.props.component) { // if there is a component
          if (element.props.component.displayName) { // connected component
            expect(element.props.component.displayName).toBe(
              expectedStructure[element.props.path].component
            )
          } else if (element.props.component.name) {
            expect(element.props.component.name).toBe(
              expectedStructure[element.props.path].component
            )
          }
        }

        if (element.props.children) { // if subroutes
          if (Array.isArray(element.props.children)) {
            element.props.children.forEach((element) => {
              checkRoute(element, expectedStructure[element.props.path].routes)
            })
          } else {
            checkRoute(
              element.props.children,
              expectedStructure[element.props.path].routes
            )
          }
        }
      }
    }

    AppRoute.props.children.forEach((element) => {
      checkRoute(element, expectedStructure)
    })
  })

  it('should temporary use a ComingSoon function as component for routes not available yet', () => {
    const comingSoonTextElement = ComingSoon()
    expect(comingSoonTextElement).toMatchSnapshot()
  })
})
