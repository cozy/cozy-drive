import React from 'react'
import { mount } from 'enzyme'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'
import AddFolder, { AddFolder as DumbAddFolder } from './AddFolder'
import flag from 'cozy-flags'
import { createFolder } from 'drive/web/modules/navigation/duck/actions'
const originalFlag = jest.requireActual('cozy-flags').default

jest.mock('drive/web/modules/navigation/duck/actions', () => ({
  createFolder: jest.fn(() => async () => {})
}))

jest.mock('cozy-flags', () => jest.fn())

describe('AddFolder', () => {
  const setup = () => {
    const { client, store } = setupStoreAndClient({})
    jest.spyOn(client, 'create').mockResolvedValue({})
    const root = mount(
      <AppLike client={client} store={store}>
        <AddFolder />
      </AppLike>
    )
    const component = root.find(DumbAddFolder)
    return { root, client, component }
  }

  describe('cozy-client migration', () => {
    beforeEach(() => {
      flag.mockImplementation(function(name) {
        if (name === 'drive.client-migration.enabled') {
          return true
        } else {
          return originalFlag.apply(this, arguments)
        }
      })
    })

    afterEach(() => {
      flag.mockReset()
    })

    it('should dispatch a createFolder action on submit', () => {
      const { component, client } = setup()
      expect(component.props().onSubmit('Mes photos de chat'))
      expect(createFolder).toHaveBeenCalledWith(client, 'Mes photos de chat')
    })
  })
})
