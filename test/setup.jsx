/**
 * Setup utilities to be used in tests
 */

import React from 'react'
import { mount } from 'enzyme'
import { configure } from '@testing-library/react'
import CozyClient from 'cozy-client'

import configureStore from '../src/drive/store/configureStore'
import AppLike from 'test/components/AppLike'
import FolderContent from 'test/components/FolderContent'
import { generateFile } from './generate'

configure({ testIdAttribute: 'data-test-id' })

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

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

const getStoreStateWhenViewingFolder = folderId => {
  return {
    router: {
      params: {
        folderId
      }
    }
  }
}

export const setupStoreAndClient = ({ initialStoreState } = {}) => {
  const client = new CozyClient({})

  const store = configureStore({
    client,
    t: x => x,
    initialState: initialStoreState,
    logger: false
  })
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
    initialStoreState: {
      ...getStoreStateWhenViewingFolder(folderId),
      ...initialStoreState
    }
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
