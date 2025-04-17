import { getFolderContent } from './selectors'
import {
  setupFolderContent,
  setupStoreAndClient,
  mockCozyClientRequestQuery
} from 'test/setup'

jest.mock('modules/navigation/AppRoute', () => ({ routes: [] }))

mockCozyClientRequestQuery('folderid123456')

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
