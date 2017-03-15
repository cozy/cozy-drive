'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Photo } from '../../src/components/Photo'

const photoObject = {
  _id: '33dda00f0eec15bc3b3c59a615001ac8',
  created_at: '0001-01-01T00:00:00Z',
  name: 'MonImage.jpg',
  size: '150000',
  updated_at: '0001-01-01T00:00:00Z'
}

const routerObjectMock = {
  location: {
    pathname: '/mock'
  }
}

describe('Photo component', () => {
  it('should render correctly an image according a photo object and the router path', () => {
    const component = shallow(
      <Photo photo={photoObject} router={routerObjectMock} />
    )

    component.setState({
      loading: false,
      url: `http://cozy.local:8080/files/download/33dda00f0eec15bc3b3c59a615001ac8`
    })

    expect(component.node).toMatchSnapshot()
  })

  it('should handle onClick event', () => {
    const component = shallow(
      <Photo photo={photoObject} router={routerObjectMock}
        onToggle={() => {}} />
    )
    component.setState({
      loading: false,
      url: `http://cozy.local:8080/files/download/33dda00f0eec15bc3b3c59a615001ac8`
    })
    component.find('[data-input="checkbox"]').simulate('click', {stopImmediatePropagation: () => {}})
    expect(component.node).toMatchSnapshot()
  })
})
