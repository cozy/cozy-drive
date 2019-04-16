import { mount } from 'enzyme'
import React from 'react'
import realtime from 'cozy-realtime'
import { RealtimeFiles } from './RealtimeFiles'
global.cozy = {
  client: {
    offline: {
      getDatabase: jest.fn()
    }
  }
}

jest.mock('cozy-realtime', () => {
  const mockReturn = {
    onCreate: jest.fn(() => mockReturn),
    onUpdate: jest.fn(() => mockReturn),
    onDelete: jest.fn(() => mockReturn),
    unsubscribe: jest.fn(() => mockReturn)
  }
  return {
    ...require.requireActual('cozy-realtime'),
    subscribe: jest.fn(() => mockReturn)
  }
})

describe('RealTimeFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should instanciate Realtime', () => {
    const context = {
      client: {
        stackClient: {
          token: {
            token: '1'
          },
          uri: 'http://mycozy.cloud'
        }
      }
    }
    //eslint-disable-next-line
    const component = mount(<RealtimeFiles />, { context })
    expect(realtime.subscribe).toHaveBeenCalledWith(
      {
        token: '1',
        url: 'http://mycozy.cloud'
      },
      'io.cozy.files'
    )
  })

  it('should instanciate Realtime and update when context change', () => {
    const context = {
      client: {
        stackClient: {
          token: {
            token: '1'
          },
          uri: 'http://mycozy.cloud'
        }
      }
    }
    const component = mount(<RealtimeFiles />, { context })
    // jest.spyOn(realtime, 'subscribe')
    expect(realtime.subscribe).toHaveBeenCalledWith(
      {
        token: '1',
        url: 'http://mycozy.cloud'
      },
      'io.cozy.files'
    )

    component.setContext({
      client: {
        stackClient: {
          token: {
            token: '2'
          },
          uri: 'http://mycozy.cloud'
        }
      }
    })
    expect(realtime.subscribe).toHaveBeenCalledWith(
      {
        token: '2',
        url: 'http://mycozy.cloud'
      },
      'io.cozy.files'
    )
  })

  it('should instanciate Realtime even with accessToken ', () => {
    const context = {
      client: {
        stackClient: {
          token: {
            accessToken: '1'
          },
          uri: 'http://mycozy.cloud'
        }
      }
    }
    mount(<RealtimeFiles />, { context })
    // jest.spyOn(realtime, 'subscribe')
    expect(realtime.subscribe).toHaveBeenCalledWith(
      {
        token: '1',
        url: 'http://mycozy.cloud'
      },
      'io.cozy.files'
    )
  })
})
