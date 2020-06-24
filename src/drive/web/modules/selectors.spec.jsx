import CozyClient from 'cozy-client'
import { generateFile } from 'test/generate'
import { getFolderContent, getDisplayedFolder } from './selectors'
import { setupFolderContent, setupStoreAndClient } from 'test/setup'

jest.mock('cozy-sharing', () => ({}))
jest.mock('drive/web/modules/navigation/AppRoute', () => ({ routes: [] }))

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
