import React from 'react'
import AppLike from 'test/components/AppLike'
import { mount } from 'enzyme'
import { setupStoreAndClient } from 'test/setup'
import { EnhancedDeleteConfirm } from './delete'
import DeleteConfirm from '../../DeleteConfirm'

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
    const mockRouterContextValue = {
      router: {
        push: jest.fn()
      },
      location: { pathname: '/folder' }
    }
    const root = mount(
      <AppLike
        client={client}
        store={store}
        sharingContextValue={mockSharingContext}
        routerContextValue={mockRouterContextValue}
      >
        <EnhancedDeleteConfirm folder={folder} onClose={() => null} />
      </AppLike>
    )
    return { root, folder, client, mockRouterContextValue }
  }

  it('should trashFiles on confirmation', async () => {
    const { root, mockRouterContextValue } = setup()
    const confirmProps = root.find(DeleteConfirm).props()
    await confirmProps.afterConfirmation()
    expect(mockRouterContextValue.router.push).toHaveBeenCalledWith(
      '/folder/parent-folder-id'
    )
  })
})
