'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from 'cozy-ui/react/I18n'
import { ViewerToolbar } from '../../src/components/ViewerToolbar'

const routerObjectMock = {
  location: {
    pathname: '/mock/33dda00f0eec15bc3b3c59a615001ac8'
  },
  push: jest.fn()
}

describe('ViewerToolbar component', () => {
  it('should be rendered correctly with router', () => {
    const component = shallow(
      <ViewerToolbar t={mockT} router={routerObjectMock} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should use router.push with the correct parent path on the close button click', () => {
    const expectedParentPath = routerObjectMock.location.pathname.substring(0, routerObjectMock.location.pathname.lastIndexOf('/'))

    const component = shallow(
      <ViewerToolbar t={mockT} router={routerObjectMock} />
    )
    component.find('.pho-viewer-toolbar-close').simulate('click')
    expect(routerObjectMock.push.mock.calls.length).toBe(1)
    expect(routerObjectMock.push.mock.calls[0][0]).toEqual(expectedParentPath)
  })
})
