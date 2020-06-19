import CozyClient from 'cozy-client'
import { generateFile } from 'test/generate'
import { getFolderContent } from './selectors'
import { setupFolderContent } from 'test/setup'

jest.mock('cozy-sharing', () => ({}))
jest.mock('drive/web/modules/navigation/AppRoute', () => ({ routes: [] }))

beforeEach(() => {
  const files = Array(10)
    .fill(null)
    .map((x, i) => generateFile({ i }))

  jest.spyOn(CozyClient.prototype, 'requestQuery').mockResolvedValue({
    data: files.map(x => ({
      ...x,
      _type: 'io.cozy.files'
    }))
  })
})

afterEach(() => {
  CozyClient.prototype.requestQuery.mockRestore()
})

describe('getFolderContent', () => {
  it('should return content from cozy client queries', async () => {
    const folderId = 'folderid123456'
    const { store } = await setupFolderContent({ folderId })
    const state = store.getState()
    const files = getFolderContent(state, 'folderid123456')
    expect(files.length).toBe(10)
  })
})
