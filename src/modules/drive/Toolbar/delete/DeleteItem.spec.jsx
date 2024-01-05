import React from 'react'
import { mount } from 'enzyme'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'
import DeleteItem from './DeleteItem'
import { EnhancedDeleteConfirm } from './delete'

jest.mock('modules/actions/utils', () => ({
  trashFiles: jest.fn().mockResolvedValue()
}))

describe('DeleteItem', () => {
  const setup = () => {
    const displayedFolder = {
      _id: 'displayed-folder-id',
      name: 'My Folder'
    }
    const { client, store } = setupStoreAndClient({})

    jest.spyOn(store, 'dispatch')
    const onLeave = jest.fn()
    const root = mount(
      <AppLike client={client} store={store}>
        <DeleteItem
          isSharedWithMe={false}
          onLeave={onLeave}
          displayedFolder={displayedFolder}
        />
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
