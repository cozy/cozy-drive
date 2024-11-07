import { mount } from 'enzyme'
import React from 'react'

import { WebVaultClient } from 'cozy-keys-lib'

import AddFolder, { AddFolder as DumbAddFolder } from './AddFolder'
import { createFolder } from 'modules/navigation/duck/actions'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'

jest.mock('modules/navigation/duck/actions', () => ({
  createFolder: jest.fn(() => async () => {})
}))

jest.mock('cozy-flags', () => jest.fn())
jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockReturnValue({}),
  useVaultClient: jest.fn(),
  WebVaultClient: jest.fn().mockReturnValue({})
}))

const CURRENT_FOLDER_ID = 'id'

describe('AddFolder', () => {
  const setup = () => {
    const { client, store } = setupStoreAndClient({})
    const vaultClient = new WebVaultClient('http://alice.cozy.cloud')
    jest.spyOn(client, 'create').mockResolvedValue({})
    const root = mount(
      <AppLike client={client} store={store}>
        <AddFolder
          vaultClient={vaultClient}
          currentFolderId={CURRENT_FOLDER_ID}
        />
      </AppLike>
    )
    const component = root.find(DumbAddFolder)
    return { root, client, component, vaultClient }
  }

  it('should dispatch a createFolder action on submit', () => {
    const { component, client, vaultClient } = setup()
    expect(component.props().onSubmit('Mes photos de chat'))
    expect(createFolder).toHaveBeenCalledWith(
      client,
      vaultClient,
      'Mes photos de chat',
      CURRENT_FOLDER_ID,
      { isEncryptedFolder: false }
    )
  })
})
