import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import DeleteItem from './DeleteItem'
import { EnhancedDeleteConfirm } from './delete'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'

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
    const container = render(
      <AppLike client={client} store={store}>
        <DeleteItem
          isSharedWithMe={false}
          onLeave={onLeave}
          displayedFolder={displayedFolder}
        />
      </AppLike>
    )
    return { container, store, displayedFolder }
  }

  it('should show a modal', async () => {
    const { container, store, displayedFolder } = setup()
    const confirmButton = container.getByText('Remove')
    fireEvent.click(confirmButton)
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
