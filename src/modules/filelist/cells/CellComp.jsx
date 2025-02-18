import { filesize } from 'filesize'
import get from 'lodash/get'
import React, { useContext, useReducer, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { isDirectory } from 'cozy-client/dist/models/file'
import { isSharingShortcut } from 'cozy-client/dist/models/file'
import { useSharingContext } from 'cozy-sharing'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import AcceptingSharingContext from '@/lib/AcceptingSharingContext'
import { ActionMenuWithHeader } from '@/modules/actionmenu/ActionMenuWithHeader'
import {
  isRenaming as isRenamingSelector,
  getRenamingFile
} from '@/modules/drive/rename'
import FileOpener from '@/modules/filelist/FileOpener'
import FileActionVz from '@/modules/filelist/cells/FileActionVz'
import FileNameVz from '@/modules/filelist/cells/FileNameVz'
import FileNameWithThumbnail from '@/modules/filelist/cells/FileNameWithThumbnail'
import LastUpdateVz from '@/modules/filelist/cells/LastUpdateVz'
import Share from '@/modules/filelist/cells/Share'
import SizeVz from '@/modules/filelist/cells/SizeVz'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import { isReferencedByShareInSharingContext } from '@/modules/views/Folder/syncHelpers'

const CellComp = ({
  row,
  columns,
  column,
  cell,
  withFilePath,
  refreshFolderContent,
  actions,
  canInteractWith
}) => {
  const { f, t } = useI18n()
  const { isExtraLarge } = useBreakpoints()
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const { byDocId } = useSharingContext()
  const filerowMenuToggleRef = useRef()
  const { toggleSelectedItem, isItemSelected, isSelectionBarVisible } =
    useSelectionContext()
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const [showActionMenu, toggleShowActionMenu] = useReducer(
    state => !state,
    false
  )
  const isRenaming = useSelector(
    state =>
      isRenamingSelector(state) && get(getRenamingFile(state), 'id') === row.id
  )

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
  // const isRowDisabledOrInSyncFromSharing = disabled || isInSyncFromSharing // why disabled not used ??
  const isRowDisabledOrInSyncFromSharing = isInSyncFromSharing

  const toggle = e => {
    e.stopPropagation()
    toggleSelectedItem(row)
  }

  if (column.id === 'name') {
    if (!cell) {
      return '—'
    }

    return (
      <FileOpener
        file={row}
        disabled={isRowDisabledOrInSyncFromSharing}
        actionMenuVisible={showActionMenu}
        selectionModeActive={isSelectionBarVisible}
        toggle={toggle}
        isRenaming={isRenaming}
      >
        <FileNameVz
          attributes={row}
          isRenaming={isRenaming}
          interactive={!isRowDisabledOrInSyncFromSharing}
          withFilePath={withFilePath}
          formattedSize={formattedSize}
          formattedUpdatedAt={formattedUpdatedAt}
          refreshFolderContent={refreshFolderContent}
          isInSyncFromSharing={isInSyncFromSharing}
        />
      </FileOpener>
    )
  }

  if (column.id === 'updated_at') {
    if (!cell) {
      return '—'
    }

    return <LastUpdateVz date={cell} formatted={formattedUpdatedAt} />
  }

  if (column.id === 'size') {
    if (!cell) {
      return '—'
    }

    return <SizeVz filesize={formattedSize} />
  }

  if (column.id === 'share') {
    const isShared = byDocId[row.id] !== undefined

    if (isInSyncFromSharing || !isShared) {
      return '—'
    }

    return (
      <Share
        row={row}
        isRowDisabledOrInSyncFromSharing={isRowDisabledOrInSyncFromSharing}
      />
    )
  }

  if (column.id === 'menu') {
    const canInteractWithFile =
      row._id !== 'io.cozy.files.shared-drives-dir' &&
      !row._id.endsWith('.trash-dir') &&
      (typeof canInteractWith !== 'function' || canInteractWith(row))

    if (!actions || !canInteractWithFile) {
      return null
    }

    return (
      <>
        <FileActionVz
          file={row}
          ref={filerowMenuToggleRef}
          disabled={isRowDisabledOrInSyncFromSharing}
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

export default CellComp
