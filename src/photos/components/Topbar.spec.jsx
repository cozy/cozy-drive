import React from 'react'
import { mount } from 'enzyme'
import AppLike from '../../../test/components/AppLike'
import { mockedRouter } from '../../../test/__mocks__/mockedRouter'
import { Topbar } from './Topbar'
import { createMockClient } from 'cozy-client'
describe('Topbar', () => {
  let component
  const client = createMockClient({})

  const setup = isMobile => {
    const Child = props => <div {...props}> Child </div>
    component = mount(
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
  }
  it('should render the topbar for desktop', () => {
    setup(false)
    expect(component.render()).toMatchSnapshot()
  })

  it('renders the topbar for mobile and the child have the expected router', () => {
    setup(true)
    expect(component.render()).toMatchSnapshot()
    expect(component.find('Child').prop('router')).toBe(mockedRouter)
  })
})
