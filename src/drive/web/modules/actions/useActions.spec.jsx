import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { createMockClient } from 'cozy-client'

import { ModalContext } from 'drive/lib/ModalContext'
import { SharingContext, ShareModal } from 'cozy-sharing'
import { RouterContext } from 'drive/lib/RouterContext'
import AppLike from '../../../../../test/components/AppLike'
import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import { createStore } from 'redux'
import { exportFilesNative, downloadFiles, openFileWith } from './utils'
import * as rename from 'drive/web/modules/drive/rename'

import useActions from './useActions'

jest.mock('./utils', () => ({
  isAnyFileReferencedByAlbum: jest.fn(),
  exportFilesNative: jest.fn(),
  downloadFiles: jest.fn(),
  trashFiles: jest.fn(),
  openFileWith: jest.fn()
}))

describe('useActions', () => {
  const mockFolderId = '123'
  const mockStore = createStore(() => ({
    mobile: {
      url: 'cozy-url://'
    }
  }))
  const mockModalContextValue = {
    pushModal: jest.fn()
  }
  const mockSharingContextValue = {
    hasWriteAccess: jest.fn(),
    refresh: jest.fn()
  }
  const mockRouterContextValue = {
    router: {
      push: jest.fn()
    },
    location: { pathname: '/folder' }
  }
  const mockClient = createMockClient({})

  beforeEach(() => {
    jest.resetAllMocks()
    global.__TARGET__ = 'browser'
  })

  const renderActionsHook = (...hookParams) => {
    const wrapper = ({ children }) => (
      <AppLike client={mockClient} store={mockStore}>
        <ModalContext.Provider value={mockModalContextValue}>
          <SharingContext.Provider value={mockSharingContextValue}>
            <RouterContext.Provider value={mockRouterContextValue}>
              {children}
            </RouterContext.Provider>
          </SharingContext.Provider>
        </ModalContext.Provider>
      </AppLike>
    )
    return renderHook(() => useActions(...hookParams), {
      wrapper
    })
  }

  const defaultHookArgs = [
    mockFolderId,
    {
      canMove: true
    }
  ]
  const getAction = (actionKey, hookArgs = defaultHookArgs) => {
    const { result } = renderActionsHook(...hookArgs)
    return result.current[actionKey]
  }

  it('returns actions keyed by icon', () => {
    const { result } = renderActionsHook(mockFolderId, {
      canMove: true
    })
    expect(Object.keys(result.current)).toEqual([
      'share',
      'download',
      'trash',
      'openWith',
      'rename',
      'moveto',
      'qualify',
      'history',
      'phone-download'
    ])
  })

  describe('share action', () => {
    it('is only visible with write access and a single selected item', () => {
      mockSharingContextValue.hasWriteAccess.mockReturnValue(false)
      const shareActionWithoutWriteAccess = getAction('share')
      expect(shareActionWithoutWriteAccess.displayCondition(['abc'])).toBe(
        false
      )
      expect(
        shareActionWithoutWriteAccess.displayCondition(['abc', 'def'])
      ).toBe(false)

      mockSharingContextValue.hasWriteAccess.mockReturnValue(true)
      const shareAction = getAction('share')
      expect(shareAction.displayCondition(['abc'])).toBe(true)
      expect(shareAction.displayCondition(['abc', 'def'])).toBe(false)
    })

    it('shows the share modal when activated', () => {
      const shareAction = getAction('share')
      const mockDocument = { id: 'abc', name: 'my-file.md' }
      shareAction.action([mockDocument])
      expect(mockModalContextValue.pushModal).toHaveBeenCalledWith(
        <ShareModal
          document={mockDocument}
          documentType="Files"
          sharingDesc="my-file.md"
        />
      )
    })
  })

  describe('download action', () => {
    describe('desktop', () => {
      it('triggers a file download', () => {
        const downloadAction = getAction('download')
        const mockDocuments = [
          { id: 'abc', name: 'my-file.md' },
          { id: 'def', name: 'my-file-2.md' }
        ]

        downloadAction.action(mockDocuments)
        expect(downloadFiles).toHaveBeenCalledWith(mockClient, mockDocuments)
      })
    })

    describe('mobile', () => {
      beforeEach(() => {
        global.__TARGET__ = 'mobile'
      })

      afterEach(() => {
        global.window.cordova = null
      })

      it('is visible for a single file on iOS', () => {
        global.window.cordova = { platformId: 'ios' }
        const downloadAction = getAction('download')
        expect(
          downloadAction.displayCondition([{ id: 'abc', type: 'file' }])
        ).toBe(true)
        expect(
          downloadAction.displayCondition([{ id: 'abc', type: 'folder' }])
        ).toBe(false)
        expect(
          downloadAction.displayCondition([
            { id: 'abc', type: 'file' },
            { id: 'def', type: 'file' }
          ])
        ).toBe(false)
        expect(
          downloadAction.displayCondition([
            { id: 'abc', type: 'file' },
            { id: 'def', type: 'folder' }
          ])
        ).toBe(false)
      })

      it('is visible if only files are selected on android', () => {
        global.window.cordova = { platformId: 'android' }
        const downloadAction = getAction('download')
        expect(
          downloadAction.displayCondition([
            { id: 'abc', type: 'file' },
            { id: 'def', type: 'file' }
          ])
        ).toBe(true)
        expect(
          downloadAction.displayCondition([
            { id: 'abc', type: 'file' },
            { id: 'def', type: 'folder' }
          ])
        ).toBe(false)
      })

      it('export files to the device when activated', () => {
        const downloadAction = getAction('download')
        const mockDocuments = [
          { id: 'abc', name: 'my-file.md' },
          { id: 'def', name: 'my-file-2.md' }
        ]
        downloadAction.action(mockDocuments)
        expect(exportFilesNative).toHaveBeenCalledWith(
          mockClient,
          mockDocuments
        )
      })
    })
  })

  describe('trash action', () => {
    it('is only visible with write access', () => {
      mockSharingContextValue.hasWriteAccess.mockReturnValue(false)
      const trashActionWithoutWriteAccess = getAction('trash')
      expect(trashActionWithoutWriteAccess.displayCondition(['abc'])).toBe(
        false
      )
      expect(
        trashActionWithoutWriteAccess.displayCondition(['abc', 'def'])
      ).toBe(false)

      mockSharingContextValue.hasWriteAccess.mockReturnValue(true)
      const trashAction = getAction('trash')
      expect(trashAction.displayCondition(['abc'])).toBe(true)
      expect(trashAction.displayCondition(['abc', 'def'])).toBe(true)
    })

    it('shows the trash confirmation modal when activated', () => {
      const trashAction = getAction('trash')
      const mockDocuments = [
        { id: 'abc', name: 'my-file.md' },
        { id: 'def', name: 'my-file-2.md' }
      ]
      trashAction.action(mockDocuments)
      const actuallyCalledModal =
        mockModalContextValue.pushModal.mock.calls[0][0]
      expect(mockModalContextValue.pushModal).toHaveBeenCalledWith(
        <DeleteConfirm
          files={mockDocuments}
          onConfirm={actuallyCalledModal.props.onConfirm} // needs exact comparison
        />
      )
    })
  })

  describe('open action', () => {
    it('is only displayed on mobile with a single file selected', () => {
      const openAction = getAction('openWith')

      const validSelection = [{ type: 'file', id: 'abc' }]

      global.__TARGET__ = 'mobile'
      expect(openAction.displayCondition(validSelection)).toBe(true)

      global.__TARGET__ = 'browser'
      expect(openAction.displayCondition(validSelection)).toBe(false)
      expect(
        openAction.displayCondition([
          { type: 'file', id: 'abc' },
          { type: 'file', id: 'def' }
        ])
      ).toBe(false)
      expect(openAction.displayCondition([{ type: 'folder', id: 'abc' }])).toBe(
        false
      )
    })

    it('opens a file when activated', () => {
      const openAction = getAction('openWith')
      const mockDocument = { id: 'abc', name: 'my-file.md' }

      openAction.action([mockDocument])
      expect(openFileWith).toHaveBeenCalledWith(mockClient, mockDocument)
    })
  })

  describe('rename action', () => {
    it('is only visible with write access and a single selected item', () => {
      mockSharingContextValue.hasWriteAccess.mockReturnValue(false)
      const renameActionWithoutWriteAccess = getAction('rename')
      expect(renameActionWithoutWriteAccess.displayCondition(['abc'])).toBe(
        false
      )
      expect(
        renameActionWithoutWriteAccess.displayCondition(['abc', 'def'])
      ).toBe(false)

      mockSharingContextValue.hasWriteAccess.mockReturnValue(true)
      const renameAction = getAction('rename')
      expect(renameAction.displayCondition(['abc'])).toBe(true)
      expect(renameAction.displayCondition(['abc', 'def'])).toBe(false)
    })

    it('dispatches a rename action when activated', async () => {
      const renameAction = getAction('rename')
      const spy = jest.spyOn(rename, 'startRenamingAsync')
      await renameAction.action(['abc'])
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('move action', () => {
    it('is only displayed when we can move files', () => {
      const moveAction = getAction('moveto', [
        mockFolderId,
        {
          canMove: true
        }
      ])
      expect(moveAction.displayCondition()).toBe(true)

      const cantMove = getAction('moveto', [
        mockFolderId,
        {
          canMove: false
        }
      ])
      expect(cantMove.displayCondition()).toBe(false)
    })

    it('shows the move modal when activated', () => {
      const moveAction = getAction('moveto')
      const mockDocuments = [{ id: 'abc' }]
      moveAction.action(mockDocuments)
      const actuallyCalledModal =
        mockModalContextValue.pushModal.mock.calls[0][0]
      expect(mockModalContextValue.pushModal).toHaveBeenCalledWith(
        <MoveModal
          entries={mockDocuments}
          onClose={actuallyCalledModal.props.onClose} // needs exact comparison
        />
      )
    })
  })

  describe('qualify action', () => {
    it('is only displayed on mobile with a single file selected', () => {
      const qualifyAction = getAction('qualify')

      expect(
        qualifyAction.displayCondition([{ type: 'file', id: 'abc' }])
      ).toBe(true)

      expect(
        qualifyAction.displayCondition([
          { type: 'file', id: 'abc' },
          { type: 'file', id: 'def' }
        ])
      ).toBe(false)
      expect(
        qualifyAction.displayCondition([{ type: 'folder', id: 'abc' }])
      ).toBe(false)
    })

    it('shows the qualification modal when activated', () => {
      const qualifyAction = getAction('qualify')
      const mockDocument = { id: 'abc' }
      qualifyAction.action([mockDocument])
      const actuallyCalledModal =
        mockModalContextValue.pushModal.mock.calls[0][0]

      expect(mockModalContextValue.pushModal).toHaveBeenCalledWith(
        <EditDocumentQualification
          document={mockDocument}
          onQualified={actuallyCalledModal.props.onQualified}
          onClose={actuallyCalledModal.props.onClose}
        />
      )
    })
  })

  describe('versions action', () => {
    it('is only displayed on mobile with a single file selected', () => {
      const versionsAction = getAction('history')

      expect(
        versionsAction.displayCondition([{ type: 'file', id: 'abc' }])
      ).toBe(true)

      expect(
        versionsAction.displayCondition([
          { type: 'file', id: 'abc' },
          { type: 'file', id: 'def' }
        ])
      ).toBe(false)
      expect(
        versionsAction.displayCondition([{ type: 'folder', id: 'abc' }])
      ).toBe(false)
    })

    it('redirects to the history view when activated', () => {
      const versionsAction = getAction('history')
      const mockDocument = { id: 'abc' }
      versionsAction.action([mockDocument])
      expect(mockRouterContextValue.router.push).toHaveBeenCalledWith(
        '/folder/file/abc/revision'
      )
      mockRouterContextValue.location.pathname = '/folder/123'
      versionsAction.action([mockDocument])
      expect(mockRouterContextValue.router.push).toHaveBeenCalledWith(
        '/folder/123/file/abc/revision'
      )
    })
  })

  describe('offline action', () => {
    it('is only displayed on mobile with a single file selected', () => {
      const offlineAction = getAction('phone-download')

      const validSelection = [{ type: 'file', id: 'abc' }]

      global.__TARGET__ = 'mobile'
      expect(offlineAction.displayCondition(validSelection)).toBe(true)

      global.__TARGET__ = 'browser'
      expect(offlineAction.displayCondition(validSelection)).toBe(false)
      expect(
        offlineAction.displayCondition([
          { type: 'file', id: 'abc' },
          { type: 'file', id: 'def' }
        ])
      ).toBe(false)
      expect(
        offlineAction.displayCondition([{ type: 'folder', id: 'abc' }])
      ).toBe(false)
    })
  })
})
