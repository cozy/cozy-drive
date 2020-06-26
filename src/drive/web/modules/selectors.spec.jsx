import React from 'react'
import { mount } from 'enzyme'
import CozyClient from 'cozy-client'
import { generateFile } from 'test/generate'
import {
  getFolderContent,
  getDisplayedFolder,
  getCurrentViewFetchStatus,
  getCurrentFolderId,
  getCurrentFileId
} from './selectors'
import {
  setupFolderContent,
  setupStoreAndClient,
  mockCozyClientRequestQuery
} from 'test/setup'
import AppLike from 'test/components/AppLike'
import FolderContent from 'test/components/FolderContent'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

jest.mock('drive/web/modules/navigation/AppRoute', () => ({ routes: [] }))

mockCozyClientRequestQuery()

describe('getFolderContent', () => {
  it('should return an empty list if queries have not been loaded', () => {
    const folderId = 'folderid123456'
    const { store } = setupStoreAndClient()
    const state = store.getState()
    const files = getFolderContent(state, folderId)
    expect(files).toEqual(null)
  })

  it('should return content from cozy client queries', async () => {
    const folderId = 'folderid123456'
    const { store } = await setupFolderContent({ folderId })
    const state = store.getState()
    const files = getFolderContent(state, folderId)
    expect(files.length).toBe(13)
  })
})

describe('getDisplayedFolder', () => {
  it('should return the currently displayed folder as a io.cozy.file', async () => {
    const folderId = 'directory-foobar0'
    const { store } = await setupFolderContent({
      folderId,
      initialStoreState: {
        router: {
          params: {
            folderId: folderId
          }
        }
      }
    })
    const state = store.getState()
    const folder = getDisplayedFolder(state)
    expect(folder._id).toEqual(folderId)
    expect(folder.name).toEqual('foobar0')
  })
})

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('getCurrentViewFetchStatus', () => {
  it('should return the fetch status', async () => {
    const folderId = 'directory-foobar0'
    const initialStoreState = {
      router: {
        params: {
          folderId: folderId
        }
      }
    }

    const { client, store } = setupStoreAndClient({ initialStoreState })

    const sortOrder = {
      attribute: 'name',
      order: 'desc'
    }
    mount(
      <AppLike store={store} client={client}>
        <FolderContent folderId={folderId} sortOrder={sortOrder} />
      </AppLike>
    )

    const state = store.getState()
    const status = getCurrentViewFetchStatus(state)
    expect(status).toEqual('loading')

    await sleep(1)

    const state2 = store.getState()
    const status2 = getCurrentViewFetchStatus(state2)
    expect(status2).toEqual('loaded')
  })
})
describe('getCurrentFolderId', () => {
  it('test the getCurrentFolderId behavior', () => {
    expect(getCurrentFolderId('')).toBeNull()
    expect(
      getCurrentFolderId({ router: { location: { pathname: '/trash' } } })
    ).toEqual(TRASH_DIR_ID)
    expect(
      getCurrentFolderId({ router: { location: { pathname: '/folder' } } })
    ).toEqual(ROOT_DIR_ID)
    expect(
      getCurrentFolderId({ router: { params: { folderId: 'folderID' } } })
    ).toEqual('folderID')
  })
})

describe('getCurrentFileId', () => {
  it('will not crash if there is no router state', () => {
    expect(getCurrentFileId('')).toBeNull()
  })
})
