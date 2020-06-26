import React from 'react'
import AppLike from 'test/components/AppLike'
import { mount } from 'enzyme'
import CozyClient from 'cozy-client'
import configureStore from 'drive/store/configureStore'
import { EnhancedDeleteConfirm } from './delete'
import flag from 'cozy-flags'
import { trashFiles as trashFilesV2 } from 'drive/web/modules/actions/utils'
import { SharingContext } from 'cozy-sharing'
import DeleteConfirm from '../../DeleteConfirm'

jest.mock('drive/web/modules/actions/utils', () => ({
  trashFiles: jest.fn().mockResolvedValue({})
}))
jest.mock('cozy-flags', () => jest.fn())

describe('EnhancedDeleteConfirm', () => {
  const setup = () => {
    const folder = {
      _id: 'folder-id',
      name: 'My folder',
      dir_id: 'parent-folder-id'
    }
    const client = new CozyClient({})
    const store = configureStore({
      client
    })
    const mockSharingContext = {
      hasWriteAccess: () => true,
      getRecipients: () => [],
      getSharingLink: () => null
    }
    const router = {
      push: jest.fn()
    }
    const root = mount(
      <SharingContext.Provider value={mockSharingContext}>
        <AppLike client={client} store={store}>
          <EnhancedDeleteConfirm folder={folder} router={router} />
        </AppLike>
      </SharingContext.Provider>
    )
    return { root, folder, client, router }
  }

  beforeEach(() => {
    flag.mockImplementation(
      name => (name === 'drive.client-migration.enabled' ? true : false)
    )
  })

  afterEach(() => {
    flag.mockRestore()
  })

  it('should trashFiles on confirmation', async () => {
    const { root, client, folder, router } = setup()
    const confirmProps = root.find(DeleteConfirm).props()
    await confirmProps.onConfirm()
    expect(trashFilesV2).toHaveBeenCalledWith(client, [folder])
    expect(router.push).toHaveBeenCalledWith('/folder/parent-folder-id')
  })
})
