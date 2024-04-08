import { mount } from 'enzyme'
import React from 'react'

import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'

import { EnhancedDeleteConfirm } from './delete'
import DeleteConfirm from '../../DeleteConfirm'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('EnhancedDeleteConfirm', () => {
  const setup = () => {
    const folder = {
      _id: 'folder-id',
      name: 'My folder',
      dir_id: 'parent-folder-id'
    }
    const { client, store } = setupStoreAndClient({})
    const mockSharingContext = {
      hasWriteAccess: () => true,
      getRecipients: () => [],
      getSharingLink: () => null
    }
    const root = mount(
      <AppLike
        client={client}
        store={store}
        sharingContextValue={mockSharingContext}
      >
        <EnhancedDeleteConfirm folder={folder} onClose={() => null} />
      </AppLike>
    )
    return { root, folder, client }
  }

  it('should trashFiles on confirmation', async () => {
    const { root } = setup()
    const confirmProps = root.find(DeleteConfirm).props()
    await confirmProps.afterConfirmation()
    expect(mockNavigate).toHaveBeenCalledWith('/folder/parent-folder-id')
  })
})
