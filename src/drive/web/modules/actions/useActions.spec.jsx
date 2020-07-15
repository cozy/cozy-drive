import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { createMockClient } from 'cozy-client'

import { ShareModal } from 'cozy-sharing'
import AppLike from '../../../../../test/components/AppLike'
import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'
import { createStore } from 'redux'
import {
  exportFilesNative,
  downloadFiles,
  openFileWith,
  restoreFiles
} from './utils'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import * as renameModule from 'drive/web/modules/drive/rename'
import * as selectionModule from 'drive/web/modules/selection/duck'

import useActions from './useActions'
import {
  share,
  download,
  trash,
  open,
  rename,
  move,
  qualify,
  versions,
  offline,
  restore,
  destroy
} from './index'

jest.mock('./utils', () => ({
  isAnyFileReferencedByAlbum: jest.fn(),
  exportFilesNative: jest.fn(),
  downloadFiles: jest.fn(),
  trashFiles: jest.fn(),
  openFileWith: jest.fn(),
  restoreFiles: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/helpers/tracker', () => ({
  getTracker: jest.fn()
}))

describe('useActions', () => {
  const mockStore = createStore(() => ({
    mobile: {
      url: 'cozy-url://'
    }
  }))
  const mockModalContextValue = {
    pushModal: jest.fn()
  }
  const mockSharingContextValue = {
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

  const renderActionsHook = hookArgs => {
    const wrapper = ({ children }) => (
      <AppLike
        client={mockClient}
        store={mockStore}
        routerContextValue={mockRouterContextValue}
        modalContextValue={mockModalContextValue}
        sharingContextValue={mockSharingContextValue}
      >
        {children}
      </AppLike>
    )
    return renderHook(
      () =>
        useActions(
          [
            share,
            download,
            trash,
            open,
            rename,
            move,
            qualify,
            versions,
            offline,
            restore,
            destroy
          ],
          hookArgs
        ),
      {
        wrapper
      }
    )
  }

  const defaultHookArgs = {
    hasWriteAccess: true,
    canMove: true,
    client: mockClient,
    pushModal: mockModalContextValue.pushModal,
    popModal: mockModalContextValue.popModal,
    refresh: mockSharingContextValue.refresh,
    dispatch: jest.fn(),
    router: mockRouterContextValue.router,
    location: mockRouterContextValue.location
  }

  const getAction = (actionKey, hookArgs) => {
    const { result } = renderActionsHook({ ...defaultHookArgs, ...hookArgs })
    return result.current[actionKey]
  }

  it('returns actions keyed by icon', () => {
    const { result } = renderActionsHook(defaultHookArgs)
    expect(Object.keys(result.current)).toEqual([
      'share',
      'download',
      'trash',
      'openWith',
      'rename',
      'moveto',
      'qualify',
      'history',
      'phone-download',
      'restore',
      'destroy'
    ])
  })

  it('always hides the selection bar after an action is activated', () => {
    const { result } = renderActionsHook(defaultHookArgs)

    Object.values(result.current).forEach(action => {
      if (action.action) {
        const hideSelectionBar = jest.spyOn(selectionModule, 'hideSelectionBar')
        action.action([{ id: 'abc', name: 'my-file.md' }])
        expect(hideSelectionBar).toHaveBeenCalled()
        hideSelectionBar.mockRestore()
      }
    })
  })

  describe('share action', () => {
    it('is only visible with write access and a single selected item', () => {
      const shareActionWithoutWriteAccess = getAction('share', {
        hasWriteAccess: false
      })
      expect(shareActionWithoutWriteAccess.displayCondition(['abc'])).toBe(
        false
      )
      expect(
        shareActionWithoutWriteAccess.displayCondition(['abc', 'def'])
      ).toBe(false)

      const shareAction = getAction('share', { hasWriteAccess: true })
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
      const trashActionWithoutWriteAccess = getAction('trash', {
        hasWriteAccess: false
      })
      expect(trashActionWithoutWriteAccess.displayCondition(['abc'])).toBe(
        false
      )
      expect(
        trashActionWithoutWriteAccess.displayCondition(['abc', 'def'])
      ).toBe(false)

      const trashAction = getAction('trash', { hasWriteAccess: true })
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
          afterConfirmation={actuallyCalledModal.props.afterConfirmation} // needs exact comparison
        />
      )

      actuallyCalledModal.props.afterConfirmation()
      expect(mockSharingContextValue.refresh).toHaveBeenCalled()
    })

    it('calls refreshFolderContent when present', () => {
      const refreshFolderContent = jest.fn()
      const trashAction = getAction('trash', { refreshFolderContent })
      const mockDocuments = [
        { id: 'abc', name: 'my-file.md' },
        { id: 'def', name: 'my-file-2.md' }
      ]
      trashAction.action(mockDocuments)
      const actuallyCalledModal =
        mockModalContextValue.pushModal.mock.calls[0][0]

      actuallyCalledModal.props.afterConfirmation()
      expect(mockSharingContextValue.refresh).toHaveBeenCalled()
      expect(refreshFolderContent).toHaveBeenCalled()
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
      const renameActionWithoutWriteAccess = getAction('rename', {
        hasWriteAccess: false
      })
      expect(renameActionWithoutWriteAccess.displayCondition(['abc'])).toBe(
        false
      )
      expect(
        renameActionWithoutWriteAccess.displayCondition(['abc', 'def'])
      ).toBe(false)

      const renameAction = getAction('rename', { hasWriteAccess: true })
      expect(renameAction.displayCondition(['abc'])).toBe(true)
      expect(renameAction.displayCondition(['abc', 'def'])).toBe(false)
    })

    it('dispatches a rename action when activated', async () => {
      const renameAction = getAction('rename')
      const spy = jest.spyOn(renameModule, 'startRenamingAsync')
      await renameAction.action(['abc'])
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('move action', () => {
    it('is only displayed when we can move files', () => {
      const moveAction = getAction('moveto', {
        canMove: true
      })
      expect(moveAction.displayCondition()).toBe(true)

      const cantMove = getAction('moveto', {
        canMove: false
      })
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

    it('registers an action with the tracker when activated', () => {
      const mockTracker = { push: jest.fn() }
      getTracker.mockReturnValueOnce(mockTracker)
      const versionsAction = getAction('history')
      const mockDocument = { id: 'abc' }
      versionsAction.action([mockDocument])
      expect(getTracker).toHaveBeenCalled()
      expect(mockTracker.push).toHaveBeenCalledWith([
        'trackEvent',
        'Drive',
        'Versioning',
        'ClickFromMenuFile'
      ])
    })

    it('does not  fail when no tracker is present', () => {
      getTracker.mockReturnValueOnce(null)
      const versionsAction = getAction('history')
      const mockDocument = { id: 'abc' }
      versionsAction.action([mockDocument])
      expect(getTracker).toHaveBeenCalled()
      expect(mockRouterContextValue.router.push).toHaveBeenCalled()
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

  describe('restore action', () => {
    it('restores files', async () => {
      const restoreAction = getAction('restore')
      const mockDocuments = [{ id: 'abc' }]
      await restoreAction.action(mockDocuments)
      expect(restoreFiles).toHaveBeenCalledWith(mockClient, mockDocuments)
      expect(mockSharingContextValue.refresh).toHaveBeenCalled()
    })
  })

  describe('destroy action', () => {
    it('Shows a confirmation modal when activated', async () => {
      const destroyAction = getAction('destroy')
      const mockDocuments = [{ id: 'abc' }]
      await destroyAction.action(mockDocuments)
      const actuallyCalledModal =
        mockModalContextValue.pushModal.mock.calls[0][0]
      expect(mockModalContextValue.pushModal).toHaveBeenCalledWith(
        <DestroyConfirm
          files={mockDocuments}
          onClose={actuallyCalledModal.props.onClose}
        />
      )
    })
  })
})
