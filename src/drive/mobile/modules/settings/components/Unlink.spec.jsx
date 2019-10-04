import React from 'react'
import { mount } from 'enzyme'
import { Unlink } from './Unlink'

jest.mock('cozy-ui/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

describe('Unlink', () => {
  const client = jest.fn()
  const options = {
    context: {
      client
    }
  }
  const unlink = jest.fn()
  const t = jest.fn(s => s)
  const clientSettings = {
    data: 'foo'
  }
  const comp = mount(
    <Unlink t={t} unlink={unlink} clientSettings={clientSettings} />,
    options
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
