import { handleFileOpen } from './FileExplorer'

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

const fetchURLSpy = jest.fn()
const client = {
  getStackClient: () => ({
    uri: 'http://cozy.tools',
    collection: () => ({
      fetchURL: fetchURLSpy
    })
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

const mockedDispatch = x => x

const mockedRouter = {
  router: {
    push: jest.fn()
  },
  location: {
    pathname: '/folder/a'
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
    it('should call native method if available offline', async () => {
      const isAvailableOffline = true
      await handleFileOpen(file, isAvailableOffline, { client }, mockedDispatch)
      expect(openLocalFile).toHaveBeenCalled()
    })
    it('should call router push if this is a file', async () => {
      const isAvailableOffline = false
      await handleFileOpen(
        file,
        isAvailableOffline,
        { ...mockedRouter, client },
        mockedDispatch
      )
      expect(mockedRouter.router.push).toHaveBeenCalledWith('/folder/a/file/1')
    })
    it('should call the stack route to open a note', async () => {
      const isAvailableOffline = false
      await handleFileOpen(
        note,
        isAvailableOffline,
        { ...mockedRouter, client },
        mockedDispatch
      )

      expect(fetchURLSpy).toHaveBeenCalled()
    })
  })
})
