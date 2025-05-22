import { filesize } from 'filesize'
import get from 'lodash/get'
import React, { useContext, useReducer, useRef } from 'react'
import { useSelector } from 'react-redux'

import { isDirectory } from 'cozy-client/dist/models/file'
import { isSharingShortcut } from 'cozy-client/dist/models/file'
import { useVaultClient } from 'cozy-keys-lib'
import { useSharingContext } from 'cozy-sharing'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import AcceptingSharingContext from '@/lib/AcceptingSharingContext'
import { ActionMenuWithHeader } from '@/modules/actionmenu/ActionMenuWithHeader'
import {
  isRenaming as isRenamingSelector,
  getRenamingFile
} from '@/modules/drive/rename'
import AddFolder from '@/modules/filelist/AddFolder'
import FileOpener from '@/modules/filelist/FileOpener'
import FileAction from '@/modules/filelist/virtualized/cells/FileAction'
import FileName from '@/modules/filelist/virtualized/cells/FileName'
import LastUpdate from '@/modules/filelist/virtualized/cells/LastUpdate'
import Share from '@/modules/filelist/virtualized/cells/Share'
import Size from '@/modules/filelist/virtualized/cells/Size'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import { isReferencedByShareInSharingContext } from '@/modules/views/Folder/syncHelpers'

const Cell = ({
  row,
  column,
  cell,
  currentFolderId,
  withFilePath,
  actions
}) => {
  const { f, t } = useI18n()
  const vaultClient = useVaultClient()

  const { isExtraLarge } = useBreakpoints()
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const { byDocId } = useSharingContext()
  const filerowMenuToggleRef = useRef()
  const { toggleSelectedItem, isSelectionBarVisible } = useSelectionContext()
  const [showActionMenu, toggleShowActionMenu] = useReducer(
    state => !state,
    false
  )
  const isRenaming = useSelector(
    state =>
      isRenamingSelector(state) && get(getRenamingFile(state), 'id') === row.id
  )

  if (row.type === 'tempDirectory') {
    if (column.id === 'name') {
      return (
        <AddFolder
          vaultClient={vaultClient}
          currentFolderId={currentFolderId}
        />
      )
    }

    if (column.id === 'menu') {
      return null
    }

    return '—'
  }

  const formattedSize =
    !isDirectory(row) && row.size ? filesize(row.size, { base: 10 }) : undefined
  const updatedAt = row.updated_at || row.created_at
  const formattedUpdatedAt = f(
    updatedAt,
    isExtraLarge
      ? t('table.row_update_format_full')
      : t('table.row_update_format')
  )
  const isSharingContextEmpty = Object.keys(sharingsValue).length <= 0
  const isInSyncFromSharing =
    !isSharingContextEmpty &&
    isSharingShortcut(row) &&
    isReferencedByShareInSharingContext(row, sharingsValue)

  if (column.id === 'name') {
    if (!cell) {
      return '—'
    }

    const toggle = e => {
      e.stopPropagation()
      toggleSelectedItem(row)
    }

    return (
      <FileOpener
        file={row}
        disabled={isInSyncFromSharing}
        actionMenuVisible={showActionMenu}
        selectionModeActive={isSelectionBarVisible}
        toggle={toggle}
        isRenaming={isRenaming}
      >
        <FileName
          attributes={row}
          isRenaming={isRenaming}
          interactive={!isInSyncFromSharing}
          withFilePath={withFilePath}
          formattedSize={formattedSize}
          formattedUpdatedAt={formattedUpdatedAt}
          isInSyncFromSharing={isInSyncFromSharing}
        />
      </FileOpener>
    )
  }

  if (column.id === 'updated_at') {
    if (!cell) {
      return '—'
    }

    return <LastUpdate date={cell} formatted={formattedUpdatedAt} />
  }

  if (column.id === 'size') {
    if (!cell) {
      return '—'
    }

    return <Size filesize={formattedSize} />
  }

  if (column.id === 'share') {
    const isShared = byDocId[row.id] !== undefined

    if (isInSyncFromSharing || !isShared) {
      return '—'
    }

    return <Share row={row} isInSyncFromSharing={isInSyncFromSharing} />
  }

  if (column.id === 'menu') {
    // We don't allow any action on shared drives and trash
    // because they are magic folder created by the stack
    const canInteractWithFile =
      row._id !== 'io.cozy.files.shared-drives-dir' &&
      !row._id.endsWith('.trash-dir')

    if (!actions || !canInteractWithFile) {
      return null
    }

    return (
      <>
        <FileAction
          file={row}
          ref={filerowMenuToggleRef}
          disabled={isInSyncFromSharing}
          onClick={toggleShowActionMenu}
        />
        {actions && showActionMenu && (
          <ActionMenuWithHeader
            file={row}
            anchorElRef={filerowMenuToggleRef}
            actions={actions}
            onClose={toggleShowActionMenu}
          />
        )}
      </>
    )
  }

  return <>{cell}</>
}

export default React.memo(Cell)
