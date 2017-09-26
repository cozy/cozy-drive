'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { OnBoarding } from '../../../../../src/targets/mobile/components/OnBoarding'

describe('Onboarding component', () => {
  it('should render step with option', () => {
    const component = renderer.create(
      <OnBoarding t={key => key} onSkip={() => {}} />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render step without option', () => {
    const component = renderer.create(<OnBoarding t={key => key} />)

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
