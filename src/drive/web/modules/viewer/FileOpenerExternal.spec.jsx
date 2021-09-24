import React from 'react'
import { shallow } from 'enzyme'
import CozyClient from 'cozy-client'

import { FileOpener } from './FileOpenerExternal'

const routerMock = {
  push: () => {},
  params: {
    fileId: '1'
  }
}

describe('FileOpenerExternal', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should set the id in state', async () => {
    const client = new CozyClient({})
    const wrapper = shallow(
      <FileOpener
        router={routerMock}
        fileId={'123'}
        routeParams={{
          fileId: '123'
        }}
        client={client}
      />,
      {
        disableLifecycleMethods: true
      }
    )

    client.query = jest.fn().mockResolvedValue({
      _id: '123'
    })

    await wrapper.instance().loadFileInfo('123')
    expect(wrapper.state().file.id).toBe('123')
  })

  it('should set the id in state even after a props update', async () => {
    const client = new CozyClient({})

    client.stackClient.fetchJSON = jest.fn()
    const wrapper = shallow(
      <FileOpener
        router={routerMock}
        fileId={'123'}
        routeParams={{
          fileId: '123'
        }}
        client={client}
      />,
      {
        disableLifecycleMethods: true
      }
    )
    client.query = jest.fn().mockResolvedValue({
      _id: '123'
    })
    await wrapper.instance().loadFileInfo('123')
    expect(wrapper.state().file.id).toBe('123')
    wrapper.setProps({
      routeParams: {
        fileId: '456'
      }
    })
    client.query = jest.fn().mockResolvedValue({
      _id: '456'
    })
    await wrapper.instance().loadFileInfo('456')
    expect(wrapper.state().file.id).toBe('456')
  })
})
