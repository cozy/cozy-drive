import { shallow } from 'enzyme'
import React from 'react'

import RecentContainer from './RecentContainer'

describe('RecentContainer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<RecentContainer additionalProp="foobar" />)
    expect(wrapper).toMatchSnapshot()
  })
})
