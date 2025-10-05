import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

jest.mock('cozy-client/dist/models/file', () => ({
  isFile: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/providers/Alert', () => ({
  useAlert: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/providers/I18n', () => ({
  useI18n: jest.fn()
}))

jest.mock('./helpers', () => ({
  isEditableTarget: jest.fn(),
  normalizeKey: jest.fn()
}))

jest.mock('@/components/pushClient', () => ({
  isMacOS: jest.fn()
}))

jest.mock('@/contexts/ClipboardProvider', () => ({
  useClipboardContext: jest.fn()
}))

jest.mock('@/hooks', () => ({
  useDisplayedFolder: jest.fn()
}))

jest.mock('@/modules/drive/rename', () => ({
  startRenamingAsync: jest.fn()
}))

jest.mock('@/modules/nextcloud/hooks/useNextcloudCurrentFolder', () => ({
  useNextcloudCurrentFolder: jest.fn()
}))

jest.mock('@/modules/paste', () => ({
  handlePasteOperation: jest.fn()
}))

jest.mock('@/modules/selection/SelectionProvider', () => ({
  useSelectionContext: jest.fn()
}))

jest.mock('cozy-flags', () => jest.fn())

import { isFile } from 'cozy-client/dist/models/file'
import flag from 'cozy-flags'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { isEditableTarget, normalizeKey } from './helpers'
import { useKeyboardShortcuts } from './useKeyboardShortcuts.tsx'

import { isMacOS } from '@/components/pushClient'
import { useClipboardContext } from '@/contexts/ClipboardProvider'
import { useDisplayedFolder } from '@/hooks'
import { startRenamingAsync } from '@/modules/drive/rename'
import { useNextcloudCurrentFolder } from '@/modules/nextcloud/hooks/useNextcloudCurrentFolder'
import { handlePasteOperation } from '@/modules/paste'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

describe('useKeyboardShortcuts', () => {
  let mockDispatch
  let mockShowAlert
  let mockT
  let mockCopyFiles
  let mockCutFiles
  let mockClearClipboard
  let mockSelectAll
  let mockClearSelection
  let mockHideSelectionBar
  let mockShowMoveValidationModal
  let mockOnPaste
  let mockClient
  let mockCurrentFolder
  let mockSelectedItems
  let mockItems
  let store

  const createWrapper = () => {
    const mockReducer = (state = {}) => state
    store = createStore(mockReducer)

    return ({ children }) => <Provider store={store}>{children}</Provider>
  }

  beforeEach(() => {
    mockDispatch = jest.fn()
    mockShowAlert = jest.fn()
    mockT = jest.fn((key, options) =>
      options?.count ? `${key}_${options.count}` : key
    )

    flag.mockImplementation(flagName => {
      if (flagName === 'drive.keyboard-shortcuts.enabled') return true
      return false
    })
    mockCopyFiles = jest.fn()
    mockCutFiles = jest.fn()
    mockClearClipboard = jest.fn()
    mockSelectAll = jest.fn()
    mockClearSelection = jest.fn()
    mockHideSelectionBar = jest.fn()
    mockShowMoveValidationModal = jest.fn()
    mockOnPaste = jest.fn()

    mockClient = {
      save: jest.fn(),
      query: jest.fn(),
      collection: jest.fn()
    }

    mockCurrentFolder = {
      _id: 'current-folder-id',
      name: 'Current Folder'
    }

    mockSelectedItems = [
      { _id: 'file1', name: 'test1.txt', type: 'file' },
      { _id: 'file2', name: 'test2.txt', type: 'file' }
    ]

    mockItems = [
      { _id: 'file1', name: 'test1.txt', type: 'file' },
      { _id: 'file2', name: 'test2.txt', type: 'file' },
      { _id: 'folder1', name: 'Test Folder', type: 'directory' }
    ]

    jest
      .spyOn(require('react-redux'), 'useDispatch')
      .mockReturnValue(mockDispatch)

    useAlert.mockReturnValue({ showAlert: mockShowAlert })
    useI18n.mockReturnValue({ t: mockT })
    useClipboardContext.mockReturnValue({
      clipboardData: {
        files: [{ _id: 'clipboard-file', name: 'clipboard.txt' }],
        operation: 'copy',
        sourceFolderId: 'source-folder-id'
      },
      copyFiles: mockCopyFiles,
      cutFiles: mockCutFiles,
      clearClipboard: mockClearClipboard,
      hasClipboardData: true,
      showMoveValidationModal: mockShowMoveValidationModal
    })
    useSelectionContext.mockReturnValue({
      selectedItems: mockSelectedItems,
      selectAll: mockSelectAll,
      hideSelectionBar: mockHideSelectionBar,
      clearSelection: mockClearSelection,
      isSelectAll: false
    })
    useDisplayedFolder.mockReturnValue({ displayedFolder: mockCurrentFolder })
    useNextcloudCurrentFolder.mockReturnValue(mockCurrentFolder)

    isFile.mockReturnValue(true)
    isEditableTarget.mockReturnValue(false)
    normalizeKey.mockImplementation((event, isApple) => {
      const key = event.key.toLowerCase()
      const ctrl = isApple ? event.metaKey : event.ctrlKey
      if (ctrl && key === 'c') return 'Ctrl+c'
      if (ctrl && key === 'x') return 'Ctrl+x'
      if (ctrl && key === 'v') return 'Ctrl+v'
      if (ctrl && key === 'a') return 'Ctrl+a'
      if (key === 'f2') return 'f2'
      if (key === 'escape') return 'escape'
      return key
    })
    isMacOS.mockReturnValue(false)
    handlePasteOperation.mockResolvedValue([
      { success: true, file: { _id: 'pasted-file' }, operation: 'copy' }
    ])

    jest.clearAllMocks()
  })

  describe('Copy Operations (Ctrl+C / Cmd+C)', () => {
    it('should copy selected files when Ctrl+C is pressed', () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            allowCopy: true
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockCopyFiles).toHaveBeenCalledWith(
        mockSelectedItems,
        mockCurrentFolder._id
      )
      expect(mockShowAlert).toHaveBeenCalledWith({
        message: 'alert.items_copied_2',
        severity: 'success'
      })
      expect(mockClearSelection).toHaveBeenCalled()
    })

    it('should show alert when copy is not allowed', () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            allowCopy: false
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockCopyFiles).not.toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith({
        message: 'alert.copy_not_allowed',
        severity: 'info'
      })
    })

    it('should filter only files for copying', () => {
      isFile.mockImplementation(item => item.type === 'file')

      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            allowCopy: true
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockCopyFiles).toHaveBeenCalledWith(
        mockSelectedItems.filter(item => item.type === 'file'),
        mockCurrentFolder._id
      )
    })
  })

  describe('Cut Operations (Ctrl+X / Cmd+X)', () => {
    it('should cut selected items when Ctrl+X is pressed', () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'x',
        ctrlKey: true,
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockCutFiles).toHaveBeenCalledWith(
        mockSelectedItems,
        mockCurrentFolder._id
      )
      expect(mockShowAlert).toHaveBeenCalledWith({
        message: 'alert.items_cut_2',
        severity: 'success'
      })
      expect(mockClearSelection).toHaveBeenCalled()
    })
  })

  describe('Paste Operations (Ctrl+V / Cmd+V)', () => {
    it('should paste files when Ctrl+V is pressed', async () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            canPaste: true,
            onPaste: mockOnPaste
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
        bubbles: true
      })

      await act(async () => {
        document.dispatchEvent(event)
      })

      expect(handlePasteOperation).toHaveBeenCalledWith(
        mockClient,
        [{ _id: 'clipboard-file', name: 'clipboard.txt' }],
        'copy',
        mockCurrentFolder,
        {
          showAlert: mockShowAlert,
          t: mockT,
          sharingContext: null,
          showMoveValidationModal: mockShowMoveValidationModal
        }
      )
      expect(mockShowAlert).toHaveBeenCalledWith({
        message: 'alert.item_pasted',
        severity: 'success'
      })
      expect(mockOnPaste).toHaveBeenCalled()
    })

    it('should clear clipboard after cut operation', async () => {
      useClipboardContext.mockReturnValue({
        clipboardData: {
          files: [{ _id: 'clipboard-file', name: 'clipboard.txt' }],
          operation: 'cut',
          sourceFolderId: 'source-folder-id'
        },
        copyFiles: mockCopyFiles,
        cutFiles: mockCutFiles,
        clearClipboard: mockClearClipboard,
        hasClipboardData: true,
        showMoveValidationModal: mockShowMoveValidationModal
      })

      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            canPaste: true
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
        bubbles: true
      })

      await act(async () => {
        document.dispatchEvent(event)
      })

      expect(mockClearClipboard).toHaveBeenCalled()
    })

    it('should skip paste when cutting and pasting in same folder', async () => {
      useClipboardContext.mockReturnValue({
        clipboardData: {
          files: [{ _id: 'clipboard-file', name: 'clipboard.txt' }],
          operation: 'cut',
          sourceFolderId: mockCurrentFolder._id
        },
        copyFiles: mockCopyFiles,
        cutFiles: mockCutFiles,
        clearClipboard: mockClearClipboard,
        hasClipboardData: true,
        showMoveValidationModal: mockShowMoveValidationModal
      })

      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            canPaste: true
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
        bubbles: true
      })

      await act(async () => {
        document.dispatchEvent(event)
      })

      expect(handlePasteOperation).not.toHaveBeenCalled()
      expect(mockShowAlert).toHaveBeenCalledWith({
        message: 'alert.paste_same_folder_skipped',
        severity: 'info'
      })
    })
  })

  describe('Move with Validation Modals', () => {
    it('should call showMoveValidationModal during paste operation', async () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems,
            canPaste: true,
            sharingContext: { isShared: true }
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
        bubbles: true
      })

      await act(async () => {
        document.dispatchEvent(event)
      })

      expect(handlePasteOperation).toHaveBeenCalledWith(
        mockClient,
        expect.any(Array),
        'copy',
        mockCurrentFolder,
        expect.objectContaining({
          showMoveValidationModal: mockShowMoveValidationModal,
          sharingContext: { isShared: true }
        })
      )
    })
  })

  describe('Select All (Ctrl+A / Cmd+A)', () => {
    it('should select all items when Ctrl+A is pressed', () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockSelectAll).toHaveBeenCalledWith(mockItems)
    })

    it('should clear selection when all items are already selected', () => {
      useSelectionContext.mockReturnValue({
        selectedItems: mockSelectedItems,
        selectAll: mockSelectAll,
        hideSelectionBar: mockHideSelectionBar,
        clearSelection: mockClearSelection,
        isSelectAll: true
      })

      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockClearSelection).toHaveBeenCalled()
      expect(mockSelectAll).not.toHaveBeenCalled()
    })
  })

  describe('Rename (F2)', () => {
    it('should start renaming when F2 is pressed with single selection', () => {
      useSelectionContext.mockReturnValue({
        selectedItems: [mockSelectedItems[0]], // Single item selected
        selectAll: mockSelectAll,
        hideSelectionBar: mockHideSelectionBar,
        clearSelection: mockClearSelection,
        isSelectAll: false
      })

      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'F2',
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        startRenamingAsync(mockSelectedItems[0])
      )
    })

    it('should not start renaming when multiple items are selected', () => {
      const wrapper = createWrapper()
      renderHook(
        () =>
          useKeyboardShortcuts({
            client: mockClient,
            items: mockItems
          }),
        { wrapper }
      )

      const event = new KeyboardEvent('keydown', {
        key: 'F2',
        bubbles: true
      })

      act(() => {
        document.dispatchEvent(event)
      })

      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })
})
