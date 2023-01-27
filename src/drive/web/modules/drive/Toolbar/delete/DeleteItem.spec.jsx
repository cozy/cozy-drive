import React from 'react'
import { mount } from 'enzyme'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'
import DeleteItem from './DeleteItem'
import { EnhancedDeleteConfirm } from './delete'
import useDisplayedFolder from 'drive/hooks/useDisplayedFolder'

jest.mock('drive/web/modules/selectors', () => ({
  getDisplayedFolder: jest.fn(),
  getCurrentFolderId: jest.fn()
}))

jest.mock('drive/web/modules/actions/utils', () => ({
  trashFiles: jest.fn().mockResolvedValue()
}))

jest.mock('drive/hooks/useDisplayedFolder')

describe('DeleteItem', () => {
  const setup = () => {
    const displayedFolder = {
      _id: 'displayed-folder-id',
      name: 'My Folder'
    }
    useDisplayedFolder.mockReturnValue(displayedFolder)
    const { client, store } = setupStoreAndClient({})

    jest.spyOn(store, 'dispatch')
    const onLeave = jest.fn()
    const root = mount(
      <AppLike client={client} store={store}>
        <DeleteItem isSharedWithMe={false} onLeave={onLeave} />
      </AppLike>
    )
    return { root, store, displayedFolder }
  }

  it('should show a modal', () => {
    const { root, store, displayedFolder } = setup()
    const menuItem = root.find('ActionMenuItem')
    menuItem.simulate('click')
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SHOW_MODAL',
        component: expect.objectContaining({
          type: EnhancedDeleteConfirm,
          props: expect.objectContaining({
            folder: displayedFolder
          })
        })
      })
    )
  })
})
