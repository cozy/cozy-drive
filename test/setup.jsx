/**
 * Setup utilities to be used in tests
 */

import { configure } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import CozyClient from 'cozy-client'

import AppLike from 'test/components/AppLike'
import FolderContent from 'test/components/FolderContent'

import { generateFile } from './generate'
import configureStore from '../src/store/configureStore'

jest.mock('cozy-keys-lib', () => ({
  withVaultClient: BaseComponent => {
    const Component = props => (
      <>
        {({ vaultClient }) => (
          <BaseComponent vaultClient={vaultClient} {...props} />
        )}
      </>
    )

    Component.displayName = `withVaultClient(${
      BaseComponent.displayName || BaseComponent.name
    })`

    return Component
  },
  useVaultClient: jest.fn()
}))

configure({ testIdAttribute: 'data-testid' })

export const mockCozyClientRequestQuery = () => {
  beforeEach(() => {
    const files = Array(10)
      .fill(null)
      .map((x, i) => generateFile({ i }))
    const directories = Array(3)
      .fill(null)
      .map((x, i) => generateFile({ i, type: 'directory' }))
    const fileAndDirs = directories.concat(files)
    jest.spyOn(CozyClient.prototype, 'requestQuery').mockResolvedValue({
      data: fileAndDirs
    })
  })

  afterEach(() => {
    CozyClient.prototype.requestQuery.mockRestore()
  })
}

export const setupStore = ({
  client,
  initialStoreState,
  setStoreToClient = true
} = {}) => {
  return configureStore({
    client,
    t: x => x,
    initialState: initialStoreState,
    logger: false,
    setStoreToClient
  })
}

export const setupStoreAndClient = ({ initialStoreState } = {}) => {
  const client = new CozyClient({
    store: false
  })
  client.getStackClient().setUri('http://test.cloud')

  const store = setupStore({ client, initialStoreState })
  return { store, client }
}

/**
 * Helper function for tests
 *
 * - Mounts a FolderContent view with a client and the store of the app
 * - CozyClient::requestQuery needs to be mocked
 * - After mount, the store should have content in .cozy.queries
 */
const setupFolderContent = async ({ folderId, initialStoreState }) => {
  const { client, store } = setupStoreAndClient({
    initialStoreState
  })

  const sortOrder = {
    attribute: 'name',
    order: 'desc'
  }
  let root

  await act(async () => {
    root = mount(
      <AppLike store={store} client={client}>
        <FolderContent folderId={folderId} sortOrder={sortOrder} />
      </AppLike>
    )

    await root.update()
  })

  return { root, store, client }
}

export { setupFolderContent }
