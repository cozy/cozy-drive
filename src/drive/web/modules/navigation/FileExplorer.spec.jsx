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

jest.mock('cozy-client', () => {
  return {
    ...require.requireActual('cozy-client'),
    models: {
      ...require.requireActual('cozy-client').models,
      applications: {
        isInstalled: jest.fn(),
        getStoreInstallationURL: jest.fn(),
        getUrl: jest.fn()
      }
    }
  }
})

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
      delete global.window.location
      global.window.location = {
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
      handleFileOpen(file, isAvailableOffline, {}, mockedDispatch)
      expect(openLocalFile).toHaveBeenCalled()
    })
    it('should call router push if this is a file', () => {
      const isAvailableOffline = false
      handleFileOpen(
        file,
        isAvailableOffline,
        { ...mockedRouter },
        mockedDispatch
      )
      expect(mockedRouter.router.push).toHaveBeenCalledWith('/folder/a/file/1')
    })
    it('should call the method to generate the URL to install the notes app from the store', () => {
      const isAvailableOffline = false
      models.applications.isInstalled = jest.fn().mockReturnValue(false)

      handleFileOpen(
        note,
        isAvailableOffline,
        { ...mockedRouter, ...notesNotInstalled },
        mockedDispatch
      )
      expect(models.applications.getStoreInstallationURL).toHaveBeenCalled()
    })
    it('should call the method to get the Notes url', () => {
      const isAvailableOffline = false
      models.applications.isInstalled.mockReturnValue({
        links: { related: 'http://notes.foo.bar/' }
      })
      models.applications.getUrl.mockReturnValue('http://notes.foo.bar/')
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
        { ...mockedRouter, ...notesInstalled },
        mockedDispatch
      )
      expect(models.applications.getUrl).toHaveBeenCalled()
      expect(window.location.href).toEqual(url)
    })
  })

  it('should call the router.push is the returned URL is empty', () => {
    const isAvailableOffline = false
    models.applications.getStoreInstallationURL.mockReturnValue('')

    handleFileOpen(
      note,
      isAvailableOffline,
      { ...mockedRouter, ...notesNotInstalled },
      mockedDispatch
    )
    expect(mockedRouter.router.push).toHaveBeenCalledWith('/folder/a/file/2')
  })
})
