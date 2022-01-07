import React from 'react'
import { mount } from 'enzyme'
import { Unlink } from './Unlink'

describe('Unlink', () => {
  const client = {
    stackClient: {
      token: {
        token: '1'
      },
      uri: 'http://mycozy.cloud'
    }
  }

  const unlink = jest.fn()
  const t = jest.fn(s => s)
  const clientSettings = {
    data: 'foo'
  }
  const comp = mount(
    <Unlink
      t={t}
      unlink={unlink}
      clientSettings={clientSettings}
      client={client}
    />
  )

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the Component', () => {
    expect(comp).toMatchSnapshot()
  })

  it('should call the unlink function', () => {
    const button = comp.find('Button')
    button.prop('onClick')()

    expect(unlink).toHaveBeenCalledWith(client, clientSettings)
  })
})
