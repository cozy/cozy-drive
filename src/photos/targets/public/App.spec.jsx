import React from 'react'
import { shallow } from 'enzyme'
import { App } from './App'
import { createMockClient } from 'cozy-client'

describe('Public view', () => {
  const client = createMockClient({})
  const options = {
    context: {
      t: jest.fn().mockImplementation(t => t),
      client
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
