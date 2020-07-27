import { createMockClient } from 'cozy-client'
import { generateFile } from 'test/generate'
import { openLocalFile } from 'drive/mobile/modules/offline/duck'

import createFileOpeningHandler from './createFileOpeningHandler'

jest.mock('drive/mobile/modules/offline/duck', () => ({
  openLocalFile: jest.fn()
}))

describe('createFileOpeningHandler', () => {
  const client = createMockClient({})
  const dispatch = jest.fn()
  const navigateToFile = jest.fn()
  const replaceCurrentUrl = jest.fn()
  const openInNewTab = jest.fn()
  const isFlatDomain = true

  client.getStackClient = jest.fn(() => client)
  client.collection = jest.fn(() => client)
  client.fetchURL = jest.fn()
  client.uri = 'http://cozy.tools'

  const genericFile = generateFile({ i: 0 })
  const noteFile = generateFile({
    prefix: 'my-note-',
    i: 1,
    type: 'file',
    ext: '.cozy-note'
  })
  noteFile.metadata = {
    content: '',
    schema: '',
    title: '',
    version: ''
  }
  const shortcutFile = generateFile({
    prefix: 'cozy',
    i: 2,
    type: 'file',
    ext: '.url'
  })
  shortcutFile.class = 'shortcut'

  const notAvailableOffline = false

  const setup = () =>
    createFileOpeningHandler({
      client,
      isFlatDomain,
      dispatch,
      navigateToFile,
      replaceCurrentUrl,
      openInNewTab
    })

  it('opens an offline file', async () => {
    const availableOffline = true
    const handler = setup()
    await handler(genericFile, availableOffline)
    expect(openLocalFile).toHaveBeenCalledWith(genericFile)
  })

  it('navigates to a normal file', async () => {
    const handler = setup()
    await handler(genericFile, notAvailableOffline)
    expect(navigateToFile).toHaveBeenCalledWith(genericFile)
  })

  it('redirects to the notes app', async () => {
    client.fetchURL.mockResolvedValue({
      data: {
        note_id: 'note-id',
        subdomain: 'notes',
        protocol: 'https',
        instance: 'cozy-tools.cloud',
        sharecode: 'sharecode',
        public_name: 'public note'
      }
    })
    const handler = setup()
    await handler(noteFile, notAvailableOffline)
    expect(replaceCurrentUrl).toHaveBeenCalledWith(
      'https://cozy-tools-notes.cloud/public/?id=note-id&sharecode=sharecode&username=public+note#/'
    )
  })

  it('opens a shortcut in a new tab', async () => {
    const handler = setup()
    await handler(shortcutFile, notAvailableOffline)
    expect(openInNewTab).toHaveBeenCalledWith(
      `http://cozy-drive.tools/#/external/${shortcutFile.id}`
    )
  })
})
