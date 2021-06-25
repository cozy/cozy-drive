import React from 'react'
import { mount } from 'enzyme'
import { Unlink } from './Unlink'

jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

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
  const comp = mount(<Unlink t={t} unlink={unlink} client={client} />)

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the Component', () => {
    expect(comp).toMatchSnapshot()
  })

  it('should call the unlink function', () => {
    const button = comp.find('Button')
    button.prop('onClick')()

    expect(unlink).toHaveBeenCalledWith(client)
  })
})
