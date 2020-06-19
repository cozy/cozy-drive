import React from 'react'
import { mount } from 'enzyme'
import configureStore from '../../store/configureStore'
import CozyClient from 'cozy-client'
import AppLike from 'test/components/AppLike'
import FolderContent from 'test/components/FolderContent'

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
/**
 * Helper function for tests
 *
 * Mounts a FolderContent view with a client and the store of the app
 */
const setupFolderContent = async ({ folderId }) => {
  const client = new CozyClient({})

  const store = configureStore({
    client,
    t: x => x
  })
  const sortOrder = {
    attribute: 'name',
    order: 'desc'
  }
  const root = mount(
    <AppLike store={store} client={client}>
      <FolderContent folderId={folderId} sortOrder={sortOrder} />
    </AppLike>
  )

  await sleep(1)
  root.update()

  return { root, store, client }
}

export { setupFolderContent }
