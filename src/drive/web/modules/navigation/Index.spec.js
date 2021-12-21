import { createMockClient } from 'cozy-client'
const mockFileModels = require('cozy-client/dist/models/file')

import { SHAREDWITHME_DIR_ID } from 'drive/constants/config'

import { fetchSharing } from './Index'

jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockReturnValue({}),
  useVaultClient: jest.fn()
}))
const client = createMockClient({})
const router = { push: jest.fn() }
const setSharingsValue = jest.fn()
const setFileValue = jest.fn()
const sharingRes = { data: { id: '123' } }
const referencedFilesRes = { included: [{ id: 'fileId', dir_id: 'dirId' }] }

const setup = async ({ sharingId, withReferencedFiles, withShortcut } = {}) => {
  client.query = jest
    .fn()
    .mockReturnValue(sharingId ? sharingRes : { data: [] })
  mockFileModels.isSharingShortcut = () => (withShortcut ? true : false)
  client.collection = jest.fn(() => ({
    findReferencedBy: jest
      .fn()
      .mockReturnValue(
        withReferencedFiles ? referencedFilesRes : { included: [] }
      )
  }))

  await fetchSharing({
    client,
    router,
    sharingsValue: {},
    setSharingsValue: setSharingsValue,
    setFileValue: setFileValue,
    sharingId
  })
}

/**
 * Here's how it works: if there is a sharing id, we are in the sharing process.
 * If there is a reference file, it means that a file in the current folder is linked to the current share.
 * So we can check if it's a shortcut and then store it in the context to use it in the view.
 * As for the redirection, it is done according to whether there is a reference file or not.
 */
describe('fetchSharing', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to /folder and store nothing in context, if no sharing id', async () => {
    await setup()

    expect(setSharingsValue).not.toHaveBeenCalled()
    expect(setFileValue).not.toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/folder')
  })

  it('should redirect to /shared-with-me-dir and store sharing in context, if sharing id but no referenced file', async () => {
    await setup({
      sharingId: '123'
    })

    expect(setSharingsValue).toHaveBeenCalled()
    expect(setFileValue).not.toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith(`/folder/${SHAREDWITHME_DIR_ID}`)
  })

  it('should redirect to /folder/dirId and store nothing in context, if sharing id and referenced file but no shortcut', async () => {
    await setup({
      sharingId: '123',
      withReferencedFiles: true
    })

    expect(setSharingsValue).not.toHaveBeenCalled()
    expect(setFileValue).not.toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/folder/dirId')
  })

  it('should redirect to /folder/dirId and store sharing and file in context, if sharing id, referenced file and shortcut', async () => {
    await setup({
      sharingId: '123',
      withReferencedFiles: true,
      withShortcut: true
    })

    expect(setSharingsValue).toHaveBeenCalled()
    expect(setFileValue).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/folder/dirId')
  })
})
