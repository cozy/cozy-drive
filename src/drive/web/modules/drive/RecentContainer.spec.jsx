import { shallow } from 'enzyme'
import React from 'react'
jest.mock('cozy-ui/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))
import RecentContainer from './RecentContainer'

describe('RecentContainer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<RecentContainer additionalProp="foobar" />)
    expect(wrapper).toMatchSnapshot()
  })
})
