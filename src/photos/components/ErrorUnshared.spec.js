import React from 'react'
import { shallow } from 'enzyme'
import ErrorUnshared from './ErrorUnshared'

describe('ErrorUnshared', () => {
  test('should match the snapshot', () => {
    const errorUnsharedInstance = shallow(<ErrorUnshared />)
    expect(errorUnsharedInstance).toMatchSnapshot()
  })
})
