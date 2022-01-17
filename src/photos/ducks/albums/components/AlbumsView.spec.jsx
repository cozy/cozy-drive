import React from 'react'
import { mount } from 'enzyme'
import PropTypes from 'prop-types'
import AppLike from 'test/components/AppLike'
import { mockedRouter } from 'test/__mocks__/mockedRouter'

import AlbumsView from './AlbumsView'
import { createMockClient } from 'cozy-client'

describe('AlbumsView', () => {
  const client = createMockClient({})
  const setup = ({ albums }) => {
    const component = mount(
      <AppLike client={client}>
        <AlbumsView albums={albums} />
      </AppLike>,
      {
        context: {
          router: {
            ...mockedRouter
          }
        },
        childContextTypes: {
          router: PropTypes.object
        }
      }
    )
    return { component }
  }
  it('displays an empty Component', () => {
    // TODO : analyse why so many translations are missing in this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

    const { component } = setup({ albums: { data: [] } })
    expect(component.render()).toMatchSnapshot()

    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })
})
