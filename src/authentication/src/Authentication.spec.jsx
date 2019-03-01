import Authentication from './Authentication'
import React from 'react'
import { shallow } from 'enzyme'

describe('Authentication', () => {
  let root, client, instance
  const setup = client => {
    const options = {
      context: { client }
    }
    root = shallow(
      <Authentication onComplete={() => {}} onException={() => {}} />,
      options
    )
    instance = root.instance()
  }

  it('should connect to server with cozy-client-js', () => {
    client = {
      register: jest.fn()
    }
    setup(client)
    instance.connectToServer('pbrowne.mycozy.cloud')
    expect(client.register).toHaveBeenCalled()
  })

  it('should connect to server with cozy-client', () => {
    client = {
      stackClient: {
        register: jest.fn()
      },
      getStackClient: () => client.stackClient
    }
    setup(client)
    instance.connectToServer('pbrowne.mycozy.cloud')
    expect(client.stackClient.register).toHaveBeenCalled()
  })
})
