import { handleFileOpen } from './FileExplorer'
import { models } from 'cozy-client'

import { openLocalFile } from 'drive/mobile/modules/offline/duck'
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))
jest.mock('drive/mobile/modules/offline/duck', () => {
  return {
    ...require.requireActual('drive/mobile/modules/offline/duck'),
    openLocalFile: jest.fn()
  }
})
jest.mock('cozy-client')

const client = {
  getStackClient: () => ({
    uri: 'http://cozy.tools'
  })
}
const file = {
  _id: '1',
  id: '1',
  type: 'file',
  name: 'file1'
}

const note = {
  _id: '2',
  id: '2',
  type: 'file',
  name: 'test.cozy-note',
  metadata: {
    content: 'content',
    schema: [],
    title: 'title',
    version: '0'
  },
  cozyMetadata: {
    createdOn: 'http://cozy.tools/'
  }
}

const sharedNote = {
  _id: '3',
  id: '3',
  type: 'file',
  name: 'test.cozy-note',
  metadata: {
    content: 'content',
    schema: [],
    title: 'title',
    version: '0'
  },
  cozyMetadata: {
    createdOn: 'http://q.cozy.tools/'
  }
}

const mockedDispatch = x => x

const mockedRouter = {
  router: {
    push: jest.fn()
  },
  location: {
    pathname: '/folder/a'
  }
}

const notesNotInstalled = {
  apps: {
    data: []
  }
}

const notesInstalled = {
  apps: {
    data: [{ slug: 'notes' }, { slug: 'store' }]
  }
}
describe('FileExplorer', () => {
  describe('handleFileOpen', () => {
    const originalLocation = global.window.location

    beforeEach(() => {
      delete window.location
      window.location = {
        href: ''
      }
      jest.resetModules()
    })
    afterEach(() => {
      jest.resetAllMocks()
      global.window = originalLocation
    })
    it('should call native method if available offline', () => {
      const isAvailableOffline = true
      handleFileOpen(file, isAvailableOffline, { client }, mockedDispatch)
      expect(openLocalFile).toHaveBeenCalled()
    })
    it('should call router push if this is a file', () => {
      const isAvailableOffline = false
      handleFileOpen(
        file,
        isAvailableOffline,
        { ...mockedRouter, client },
        mockedDispatch
      )
      expect(mockedRouter.router.push).toHaveBeenCalledWith('/folder/a/file/1')
    })
    it('should call the method to generate the URL to install the notes app from the store', () => {
      const isAvailableOffline = false
      models.applications.isInstalled = jest.fn().mockReturnValue(false)
      models.applications.getStoreInstallationURL = jest.fn()
      handleFileOpen(
        note,
        isAvailableOffline,
        { ...mockedRouter, ...notesNotInstalled, client },
        mockedDispatch
      )
      expect(models.applications.getStoreInstallationURL).toHaveBeenCalled()
    })
    it('should call the method to get the Notes url', () => {
      const isAvailableOffline = false
      models.applications.isInstalled.mockReturnValue({
        links: { related: 'http://notes.foo.bar/' }
      })
      models.applications.getUrl = jest
        .fn()
        .mockReturnValue('http://notes.foo.bar/')
      global.window = Object.create(window)
      const url = 'http://notes.foo.bar/#/n/' + note._id
      delete global.window.location
      Object.defineProperty(window, 'location', {
        value: {
          href: url
        },
        writable: true
      })
      handleFileOpen(
        note,
        isAvailableOffline,
        { ...mockedRouter, ...notesInstalled, client },
        mockedDispatch
      )
      expect(models.applications.getUrl).toHaveBeenCalled()
      expect(window.location.href).toEqual(url)
    })
  })

  it('should call the router.push if the returned URL is empty', () => {
    const isAvailableOffline = false
    models.applications.getStoreInstallationURL.mockReturnValue('')

    handleFileOpen(
      note,
      isAvailableOffline,
      { ...mockedRouter, ...notesNotInstalled, client },
      mockedDispatch
    )
    expect(mockedRouter.router.push).toHaveBeenCalledWith('/folder/a/file/2')
  })

  it('should call the router.push if the note is not mine', () => {
    const isAvailableOffline = false
    models.applications.getStoreInstallationURL.mockReturnValue('')

    handleFileOpen(
      sharedNote,
      isAvailableOffline,
      { ...mockedRouter, ...notesInstalled, client },
      mockedDispatch
    )
    expect(mockedRouter.router.push).toHaveBeenCalledWith('/folder/a/file/3')
  })
})
