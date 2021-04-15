import { createMockClient } from 'cozy-client'
import { generateFile } from 'test/generate'
import { openLocalFile } from 'drive/mobile/modules/offline/duck'
import { isOnlyOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'

import createFileOpeningHandler from './createFileOpeningHandler'

jest.mock('drive/mobile/modules/offline/duck', () => ({
  openLocalFile: jest.fn()
}))

jest.mock('drive/web/modules/views/OnlyOffice/helpers', () => ({
  ...jest.requireActual('drive/web/modules/views/OnlyOffice/helpers'),
  isOnlyOfficeEnabled: jest.fn()
}))

describe('createFileOpeningHandler', () => {
  const client = createMockClient({})
  const dispatch = jest.fn()
  const navigateToFile = jest.fn()
  const replaceCurrentUrl = jest.fn()
  const openInNewTab = jest.fn()
  const routeTo = jest.fn()
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

  const onlyofficeFile = generateFile({ i: 3 })
  onlyofficeFile.class = 'slide'

  const notAvailableOffline = false

  const setup = () =>
    createFileOpeningHandler({
      client,
      isFlatDomain,
      dispatch,
      navigateToFile,
      replaceCurrentUrl,
      openInNewTab,
      routeTo
    })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should open an offline file', async () => {
    const availableOffline = true
    const handler = setup()
    await handler({ file: genericFile, availableOffline })
    expect(openLocalFile).toHaveBeenCalledWith(genericFile)
  })

  it('should navigate to a normal file', async () => {
    const handler = setup()
    await handler({ file: genericFile, notAvailableOffline })
    expect(navigateToFile).toHaveBeenCalledWith(genericFile)
  })

  it('should redirect to the notes app', async () => {
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
    await handler({ file: noteFile, notAvailableOffline })
    expect(replaceCurrentUrl).toHaveBeenCalledWith(
      'https://cozy-tools-notes.cloud/public/?id=note-id&sharecode=sharecode&username=public+note#/'
    )
  })

  it('should open a shortcut in a new tab', async () => {
    const handler = setup()
    await handler({ file: shortcutFile, notAvailableOffline })
    expect(openInNewTab).toHaveBeenCalledWith(
      `http://cozy-drive.tools/#/external/${shortcutFile.id}`
    )
  })

  it('should redirect to the file for an onlyoffice document with onlyoffice activated', async () => {
    isOnlyOfficeEnabled.mockReturnValue(true)
    const handler = setup()
    await handler({ event: {}, file: onlyofficeFile, notAvailableOffline })

    expect(openInNewTab).not.toHaveBeenCalled()
    expect(replaceCurrentUrl).not.toHaveBeenCalled()
    expect(routeTo).toHaveBeenCalledWith(`/onlyoffice/${onlyofficeFile.id}`)
    expect(navigateToFile).not.toHaveBeenCalled()
  })

  it('should open the onlyoffice file in a new tab with onlyoffice activated and key pressed when clicking the link', async () => {
    isOnlyOfficeEnabled.mockReturnValue(true)
    const events = [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }]
    const handler = setup()

    for (const event of events) {
      await handler({
        event,
        file: onlyofficeFile,
        notAvailableOffline
      })

      expect(openInNewTab).toHaveBeenCalled()
      expect(replaceCurrentUrl).not.toHaveBeenCalled()
      expect(routeTo).not.toHaveBeenCalled()
      expect(navigateToFile).not.toHaveBeenCalled()
      jest.clearAllMocks()
    }
  })

  it('should navigate to the file for an onlyoffice document with onlyoffice not activated', async () => {
    isOnlyOfficeEnabled.mockReturnValue(false)
    const handler = setup()
    await handler({ event: {}, file: onlyofficeFile, notAvailableOffline })

    expect(openInNewTab).not.toHaveBeenCalled()
    expect(replaceCurrentUrl).not.toHaveBeenCalled()
    expect(navigateToFile).toHaveBeenCalled()
  })
})
