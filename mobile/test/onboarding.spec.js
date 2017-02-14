'use strict'

import React from 'react'
import renderer from 'react-test-renderer'

import Wizard from '../../mobile/src/components/Wizard'
import { SelectServer } from '../../mobile/src/containers/onboarding/SelectServer'
import { Welcome } from '../../mobile/src/containers/onboarding/Welcome'

describe('Onboarding', () => {
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

  it('should render the welcome screen', () => {
    const component = renderer.create(<Welcome t={() => {}} />)

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render the SelectServer screen', () => {
    const component = renderer.create(<SelectServer t={() => {}} />)

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
