import React from 'react'
import { shallow } from 'enzyme'
import { App } from './App'

describe('Public view', () => {
  const options = {
    context: {
      t: jest.fn()
    }
  }

  it('should render the album', () => {
    const app = shallow(
      <App album={{}} hasMore={false} fetchMore={jest.fn()} photos={[]} />,
      options
    )
    const selection = app.find('Selection')
    expect(selection.dive()).toMatchSnapshot()
  })

  it('should render children when they are present', () => {
    const app = shallow(
      <App album={{}} hasMore={false} fetchMore={jest.fn()} photos={[1, 2, 3]}>
        <div />
      </App>,
      options
    )
    const selection = app.find('Selection')
    expect(selection.dive()).toMatchSnapshot()
  })
})
