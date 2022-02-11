import React from 'react'
import { mount } from 'enzyme'
import AppLike from 'test/components/AppLike'
import { mockedRouter } from 'test/__mocks__/mockedRouter'
import { Topbar } from './Topbar'
import { createMockClient } from 'cozy-client'

jest.mock('cozy-intent', () => ({
  WebviewIntentProvider: ({ children }) => children
}))

describe('Topbar', () => {
  const client = createMockClient({})

  const setup = ({ isMobile }) => {
    const Child = props => <div {...props}> Child </div>
    const component = mount(
      <AppLike client={client}>
        <Topbar
          breakpoints={{ isMobile: isMobile }}
          router={mockedRouter}
          viewName="albumContent"
          t={x => x}
          client={client}
        >
          <Child router={mockedRouter} />
        </Topbar>
      </AppLike>
    )
    return { component }
  }
  it('should render the topbar for desktop', () => {
    const { component } = setup({ isMobile: false })
    expect(component.render()).toMatchSnapshot()
  })

  it('renders the topbar for mobile and the child have the expected router', () => {
    const { component } = setup({ isMobile: true })
    expect(component.render()).toMatchSnapshot()
    expect(component.find('Child').prop('router')).toBe(mockedRouter)
  })
})
