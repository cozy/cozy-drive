import React from 'react'
import { mount } from 'enzyme'
import CozyClient from 'cozy-client'
import configureStore from 'drive/store/configureStore'
import AppLike from 'test/components/AppLike'
import DeleteItem from './DeleteItem'
import { EnhancedDeleteConfirm } from './delete'

jest.mock('drive/web/modules/actions/utils', () => ({
  trashFiles: jest.fn().mockResolvedValue()
}))

describe('DeleteItem', () => {
  const setup = () => {
    const client = new CozyClient()
    const displayedFolder = {
      _id: 'displayed-folder-id',
      name: 'My Folder'
    }
    const store = configureStore({
      client,
      initialState: {
        view: {
          displayedFolder
        }
      }
    })

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
