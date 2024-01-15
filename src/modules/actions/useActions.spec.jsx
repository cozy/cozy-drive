import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { createStore } from 'redux'

import { createMockClient } from 'cozy-client'

import {
  share,
  download,
  trash,
  rename,
  move,
  qualify,
  versions,
  restore,
  destroy
} from './index'
import useActions from './useActions'
import { downloadFiles, restoreFiles } from './utils'
import DeleteConfirm from 'modules/drive/DeleteConfirm'
import * as renameModule from 'modules/drive/rename'
import { useSelectionContext } from 'modules/selection/SelectionProvider'
import DestroyConfirm from 'modules/trash/components/DestroyConfirm'
import AppLike from 'test/components/AppLike'

jest.mock('./utils', () => ({
  downloadFiles: jest.fn(),
  trashFiles: jest.fn(),
  openFileWith: jest.fn(),
  restoreFiles: jest.fn()
}))

jest.mock('modules/selection/SelectionProvider', () => ({
  ...jest.requireActual('modules/selection/SelectionProvider'),
  useSelectionContext: jest.fn()
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
  const mockRefresh = jest.fn()
  const mockClient = createMockClient({})
  const mockVaultClient = {}

  beforeEach(() => {
    jest.resetAllMocks()
    global.__TARGET__ = 'browser'
  })

  const renderActionsHook = (
    hookArgs,
    options = { hideSelectionBar: jest.fn() }
  ) => {
    useSelectionContext.mockReturnValue({
      hideSelectionBar: options.hideSelectionBar
    })
    const wrapper = ({ children }) => (
      <AppLike
        client={mockClient}
        vaultClient={mockVaultClient}
        store={mockStore}
        modalContextValue={mockModalContextValue}
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
            rename,
            move,
            qualify,
            versions,
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
    vaultClient: mockVaultClient,
    pushModal: mockModalContextValue.pushModal,
    popModal: mockModalContextValue.popModal,
    refresh: mockRefresh,
    dispatch: jest.fn(),
    navigate: jest.fn(),
    pathname: '/folder'
  }

  const getAction = (actionKey, hookArgs) => {
    const { result } = renderActionsHook({ ...defaultHookArgs, ...hookArgs })
    let action
    result.current.map((actionObject, i) => {
      if (Object.keys(actionObject)[0] === actionKey) {
        action = result.current[i][actionKey]
      }
    })
    return action
  }

  it('returns actions keyed by icon', () => {
    const { result } = renderActionsHook(defaultHookArgs)
    const keys = result.current.map(actionObject => {
      return Object.keys(actionObject)[0]
    })
    expect(keys).toEqual([
      'share',
      'download',
      'trash',
      'rename',
      'moveto',
      'qualify',
      'history',
      'restore',
      'destroy'
    ])
  })

  it('always hides the selection bar after an action is activated', () => {
    const hideSelectionBar = jest.fn()
    const { result } = renderActionsHook(defaultHookArgs, { hideSelectionBar })

    Object.values(result.current).forEach(action => {
      if (action.action) {
        action.action([{ id: 'abc', name: 'my-file.md' }])
        expect(hideSelectionBar).toHaveBeenCalled()
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
      const navigate = jest.fn()
      const shareAction = getAction('share', {
        navigate,
        pathname: 'folder/:folderId'
      })
      const mockDocument = { id: 'abc' }
      shareAction.action([mockDocument])
      expect(navigate).toHaveBeenCalledWith('folder/:folderId/file/abc/share')
    })
  })

  describe('download action', () => {
    it('triggers a file download', () => {
      const downloadAction = getAction('download')
      const mockDocuments = [
        { id: 'abc', name: 'my-file.md' },
        { id: 'def', name: 'my-file-2.md' }
      ]

      downloadAction.action(mockDocuments)
      expect(downloadFiles).toHaveBeenCalledWith(mockClient, mockDocuments, {
        vaultClient: {}
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
      expect(mockRefresh).toHaveBeenCalled()
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
      const navigate = jest.fn()
      const moveAction = getAction('moveto', {
        navigate,
        pathname: 'folder/:folderId'
      })
      const mockDocument = { id: 'abc' }
      moveAction.action([mockDocument])
      expect(navigate).toHaveBeenCalledWith('folder/:folderId/move', {
        state: { fileIds: ['abc'] }
      })
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
      const navigate = jest.fn()
      const qualifyAction = getAction('qualify', {
        navigate,
        pathname: 'folder/:folderId'
      })
      const mockDocument = { id: 'abc' }
      qualifyAction.action([mockDocument])
      expect(navigate).toHaveBeenCalledWith('folder/:folderId/file/abc/qualify')
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
      const navigate = jest.fn()
      const versionsAction = getAction('history', {
        navigate,
        pathname: 'folder/:folderId'
      })
      const mockDocument = { id: 'abc' }
      versionsAction.action([mockDocument])
      expect(navigate).toHaveBeenCalledWith(
        'folder/:folderId/file/abc/revision'
      )
    })
  })

  describe('restore action', () => {
    it('restores files', async () => {
      const restoreAction = getAction('restore')
      const mockDocuments = [{ id: 'abc' }]
      await restoreAction.action(mockDocuments)
      expect(restoreFiles).toHaveBeenCalledWith(mockClient, mockDocuments)
      expect(mockRefresh).toHaveBeenCalled()
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
