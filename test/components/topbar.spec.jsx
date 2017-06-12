'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { Topbar } from '../../src/components/Topbar'

const routerObjectMock = {
  location: {
    pathname: '/albums/33dda00f0eec15bc3b3c59a615001ac8/33dda00f0eec15bc3b3c59a615001ac1'
  },
  push: jest.fn()
}

describe('Topbar component', () => {
  it('should be rendered correctly according the viewName', () => {
    const component = shallow(
      <Topbar t={mockT} viewName='photos' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly if viewName is albumContent', () => {
    const component = shallow(
      <Topbar t={mockT} viewName='albumContent' router={routerObjectMock} />
    )
    component.find('[role="button"]').simulate('click')
    expect(component.node).toMatchSnapshot()
  })
})
