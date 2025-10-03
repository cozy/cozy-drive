import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { isFile } from 'cozy-client/dist/models/file'
import CozyClient from 'cozy-client/types/CozyClient'
import { IOCozyFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { isEditableTarget, normalizeKey } from './helpers'

import { isMacOS } from '@/components/pushClient'
import { useClipboardContext } from '@/contexts/ClipboardProvider'
import { useDisplayedFolder } from '@/hooks'
import { startRenamingAsync } from '@/modules/drive/rename'
import { useNextcloudCurrentFolder } from '@/modules/nextcloud/hooks/useNextcloudCurrentFolder'
import { handlePasteOperation } from '@/modules/paste'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

interface UseKeyboardShortcutsProps {
  onPaste?: (() => void) | null
  canPaste?: boolean
  client?: CozyClient | null
  items?: IOCozyFile[]
  sharingContext?: unknown
  allowCopy?: boolean
  isNextCloudFolder?: boolean
}

export const useKeyboardShortcuts = ({
  onPaste = null,
  canPaste = false,
  client = null,
  items = [],
  sharingContext = null,
  allowCopy = true,
  isNextCloudFolder = false
}: UseKeyboardShortcutsProps): void => {
  const dispatch = useDispatch()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const {
    selectedItems,
    selectAll,
    hideSelectionBar,
    clearSelection,
    isSelectAll
  } = useSelectionContext() as unknown as {
    selectedItems: IOCozyFile[]
    selectAll: (items: IOCozyFile[]) => void
    hideSelectionBar: () => void
    clearSelection: () => void
    isSelectAll: boolean
  }
  const {
    clipboardData,
    copyFiles,
    cutFiles,
    clearClipboard,
    hasClipboardData,
    showMoveValidationModal
  } = useClipboardContext()

  const { displayedFolder } = useDisplayedFolder()
  const currentNextCloudFolder = useNextcloudCurrentFolder()
  const currentFolder = isNextCloudFolder
    ? currentNextCloudFolder
    : displayedFolder

  const isApple = isMacOS()

  const handleCopy = useCallback(() => {
    if (!allowCopy) {
      showAlert({ message: t('alert.copy_not_allowed'), severity: 'info' })
      return
    }

    if (!selectedItems.length) return

    const filesToCopy = selectedItems.filter(isFile)
    if (filesToCopy.length === 0) {
      showAlert({ message: t('alert.copy_files_only'), severity: 'info' })
      return
    }

    copyFiles(filesToCopy, currentFolder?._id)
    const message =
      filesToCopy.length === 1
        ? t('alert.item_copied')
        : t('alert.items_copied', { count: filesToCopy.length })
    showAlert({ message, severity: 'success' })
    clearSelection()
  }, [
    allowCopy,
    selectedItems,
    copyFiles,
    currentFolder,
    showAlert,
    t,
    clearSelection
  ])

  const handleCut = useCallback(() => {
    if (!selectedItems.length) return

    cutFiles(selectedItems, currentFolder?._id)
    const message =
      selectedItems.length === 1
        ? t('alert.item_cut')
        : t('alert.items_cut', { count: selectedItems.length })
    showAlert({ message, severity: 'success' })
    clearSelection()
  }, [selectedItems, cutFiles, showAlert, t, clearSelection, currentFolder])

  const handlePaste = useCallback(async () => {
    if (!hasClipboardData || !canPaste || !client || !currentFolder) return

    // Skip operation if cutting and pasting in the same folder
    if (
      clipboardData.operation === 'cut' &&
      clipboardData.sourceFolderId === currentFolder._id
    ) {
      showAlert({
        message: t('alert.paste_same_folder_skipped'),
        severity: 'info'
      })
      return
    }

    try {
      const results = await handlePasteOperation(
        client,
        clipboardData.files,
        clipboardData.operation,
        currentFolder,
        {
          showAlert,
          t,
          sharingContext,
          showMoveValidationModal
        }
      )

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      if (successCount > 0) {
        const message =
          successCount === 1
            ? t('alert.item_pasted')
            : t('alert.items_pasted', { count: successCount })
        showAlert({ message, severity: 'success' })
      } else if (failureCount > 0) {
        showAlert({
          message: t('alert.paste_failed'),
          severity: 'error'
        })
      }

      if (clipboardData.operation === 'cut') {
        clearClipboard()
      }

      onPaste?.()
    } catch (error) {
      showAlert({
        message: t('alert.paste_error'),
        severity: 'error'
      })
    }
  }, [
    hasClipboardData,
    canPaste,
    client,
    currentFolder,
    clipboardData,
    showAlert,
    t,
    sharingContext,
    showMoveValidationModal,
    clearClipboard,
    onPaste
  ])

  const handleSelectAll = useCallback(() => {
    isSelectAll ? clearSelection() : selectAll(items)
  }, [isSelectAll, clearSelection, selectAll, items])

  const handleRename = useCallback(() => {
    if (selectedItems.length === 1) {
      dispatch(startRenamingAsync(selectedItems[0]))
    }
  }, [selectedItems, dispatch])

  const handleEscape = useCallback(() => {
    hideSelectionBar()
    clearClipboard()
  }, [hideSelectionBar, clearClipboard])

  useEffect(() => {
    if (!flag('drive.keyboard-shortcuts.enabled')) {
      return
    }

    const shortcuts: Record<string, (() => void | Promise<void>) | undefined> =
      {
        'Ctrl+c': handleCopy,
        'Ctrl+x': handleCut,
        'Ctrl+v': handlePaste,
        'Ctrl+a': handleSelectAll,
        f2: handleRename,
        escape: handleEscape
      }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!event.target || isEditableTarget(event.target)) return

      const combo = normalizeKey(event, isApple)
      const handler = shortcuts[combo]

      if (handler) {
        event.preventDefault()
        void handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    isApple,
    handleCopy,
    handleCut,
    handlePaste,
    handleSelectAll,
    handleRename,
    handleEscape
  ])
}
