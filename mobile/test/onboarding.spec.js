'use strict'

import React from 'react'
import renderer from 'react-test-renderer'

import Wizard from '../../mobile/src/components/Wizard'
import { Welcome, SelectServer } from '../../mobile/src/containers/OnBoarding'

describe('Wizard Component', () => {
  it('should render different components', () => {
    const steps = [
      Welcome,
      SelectServer
    ]
    const component = renderer.create(
      <Wizard steps={steps} t={() => {}} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    tree.children[1].props.onClick()
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
