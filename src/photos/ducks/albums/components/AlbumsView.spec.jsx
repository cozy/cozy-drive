import React from 'react'
import { mount } from 'enzyme'
import PropTypes from 'prop-types'
import AppLike from '../../../../../test/components/AppLike'
import { mockedRouter } from '../../../../../test/__mocks__/mockedRouter'

import AlbumsView from './AlbumsView'
import { createMockClient } from 'cozy-client'

describe('Albumsview', () => {
  const client = createMockClient({})
  let component
  const setup = data => {
    component = mount(
      <AppLike client={client}>
        <AlbumsView albums={{ data }} />
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
  }
  it('displays an empty Component', () => {
    setup([])
    expect(component.render()).toMatchSnapshot()
  })
})
