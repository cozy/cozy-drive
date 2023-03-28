import { shallow } from 'enzyme'
import React from 'react'

import { FileOpener } from './FileOpenerExternal'
global.cozy = {
  client: {
    files: {
      statById: jest.fn()
    }
  }
}
const routerMock = {
  push: () => {},
  params: {
    fileId: '1'
  }
}
describe('FileOpenerExternal', () => {
  it('should set the id in state', async () => {
    const wrapper = shallow(
      <FileOpener
        router={routerMock}
        fileId={'123'}
        routeParams={{
          fileId: '123'
        }}
        breakpoints={{
          isDesktop: true
        }}
      />,
      {
        disableLifecycleMethods: true
      }
    )
    global.cozy.client.files.statById.mockResolvedValue({
      _id: '123'
    })
    await wrapper.instance().loadFileInfo('123')
    expect(wrapper.state().file.id).toBe('123')
  })

  it('should set the id in state even after a props update', async () => {
    const wrapper = shallow(
      <FileOpener
        router={routerMock}
        fileId={'123'}
        routeParams={{
          fileId: '123'
        }}
        breakpoints={{
          isDesktop: true
        }}
      />,
      {
        disableLifecycleMethods: true
      }
    )
    global.cozy.client.files.statById.mockResolvedValue({
      _id: '123'
    })
    await wrapper.instance().loadFileInfo('123')
    expect(wrapper.state().file.id).toBe('123')
    wrapper.setProps({
      routeParams: {
        fileId: '456'
      }
    })
    global.cozy.client.files.statById.mockResolvedValue({
      _id: '456'
    })
    await wrapper.instance().loadFileInfo('456')
    expect(wrapper.state().file.id).toBe('456')
  })
})
