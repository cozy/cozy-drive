'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { I18n } from '../../src/lib/I18n'

import { OnBoarding } from '../../mobile/src/containers/OnBoarding'

describe('OnBoarding Component', () => {
  it('should render the component if not logged in', () => {
    const component = renderer.create(
      <OnBoarding t={()=>{}} onClick={()=>{}} isLoggedIn={false} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render children if logged in', () => {
    const component = shallow(
      <OnBoarding t={()=>{}} onClick={()=>{}} isLoggedIn={true}>
        <p>Application</p>
      </OnBoarding>
    )
    expect(component.text()).toEqual('Application')
  })
})
