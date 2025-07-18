import cx from 'classnames'
import { filesize } from 'filesize'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import { isDirectory } from 'cozy-client/dist/models/file'
import Card from 'cozy-ui/transpiled/react/Card'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  SelectBox,
  FileName,
  Status,
  FileAction,
  SharingShortcutBadge
} from '../cells'

import styles from '@/styles/filelist.styl'

import { ActionMenuWithHeader } from '@/modules/actionmenu/ActionMenuWithHeader'
import { extraColumnsPropTypes } from '@/modules/certifications'
import {
  isRenaming as isRenamingReducer,
  getRenamingFile
} from '@/modules/drive/rename'
import FileOpener from '@/modules/filelist/FileOpener'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const GridFile = ({
  t,
  f,
  attributes,
  actions,
  isRenaming,
  withSelectionCheckbox,
  withFilePath,
  disabled,
  refreshFolderContent,
  isInSyncFromSharing,
  breakpoints: { isExtraLarge, isMobile },
  disableSelection = false,
  canInteractWith,
  onContextMenu
}) => {
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const filerowMenuToggleRef = useRef()
  const { toggleSelectedItem, isItemSelected, isSelectionBarVisible } =
    useSelectionContext()

  const toggleActionMenu = () => {
    if (actionMenuVisible) return hideActionMenu()
    else showActionMenu()
  }
  const showActionMenu = () => {
    setActionMenuVisible(true)
  }

  const hideActionMenu = () => {
    setActionMenuVisible(false)
  }

  const toggle = e => {
    e.stopPropagation()
    toggleSelectedItem(attributes)
  }

  const isRowDisabledOrInSyncFromSharing = disabled || isInSyncFromSharing

  const selected = isItemSelected(attributes.id)

  const formattedSize =
    !isDirectory(attributes) && attributes.size
      ? filesize(attributes.size, { base: 10 })
      : undefined

  const updatedAt = attributes.updated_at || attributes.created_at
  const formattedUpdatedAt = f(
    updatedAt,
    isExtraLarge
      ? t('table.row_update_format_full')
      : t('table.row_update_format')
  )

  // We don't allow any action on shared drives and trash
  // because they are magic folder created by the stack
  let canInteractWithFile =
    attributes._id !== 'io.cozy.files.shared-drives-dir' &&
    !attributes._id.endsWith('.trash-dir')
  if (typeof canInteractWith === 'function') {
    canInteractWithFile &&= canInteractWith(attributes)
  }

  return (
    <Card
      className={cx(
        styles['fil-content-column'],
        styles['fil-content-column-virtualized'],
        {
          [styles['fil-content-column-selected']]: selected,
          [styles['fil-content-column-actioned']]: actionMenuVisible,
          [styles['fil-content-body--selectable']]: isSelectionBarVisible
        }
      )}
      onContextMenu={onContextMenu}
    >
      <SelectBox
        viewType="grid"
        withSelectionCheckbox={withSelectionCheckbox && actions?.length > 0}
        selected={selected}
        onClick={e => toggle(e)}
        disabled={
          !canInteractWithFile ||
          isRowDisabledOrInSyncFromSharing ||
          disableSelection
        }
      />
      <FileOpener
        file={attributes}
        disabled={isRowDisabledOrInSyncFromSharing}
        actionMenuVisible={actionMenuVisible}
        selectionModeActive={isSelectionBarVisible}
        toggle={toggle}
        isRenaming={isRenaming}
      >
        <div
          className={cx(
            styles['fil-content-cell'],
            styles['fil-file-thumbnail'],
            styles['fil-content-grid-view'],
            {
              'u-pl-0': !isMobile
            }
          )}
        >
          <FileThumbnail
            file={attributes}
            size={96}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared']
              }
            }}
          />
          <Status
            file={attributes}
            disabled={isRowDisabledOrInSyncFromSharing}
            isInSyncFromSharing={isInSyncFromSharing}
          />
        </div>
        <FileName
          attributes={attributes}
          isRenaming={isRenaming}
          interactive={!isRowDisabledOrInSyncFromSharing}
          withFilePath={withFilePath}
          isMobile={isMobile}
          formattedSize={formattedSize}
          formattedUpdatedAt={formattedUpdatedAt}
          refreshFolderContent={refreshFolderContent}
          isInSyncFromSharing={isInSyncFromSharing}
        />
        <SharingShortcutBadge file={attributes} />
      </FileOpener>
      {actions && canInteractWithFile && (
        <FileAction
          t={t}
          ref={filerowMenuToggleRef}
          disabled={isRowDisabledOrInSyncFromSharing}
          isInSyncFromSharing={isInSyncFromSharing}
          onClick={() => {
            toggleActionMenu()
          }}
        />
      )}
      {actions && actionMenuVisible && (
        <ActionMenuWithHeader
          file={attributes}
          anchorElRef={filerowMenuToggleRef}
          actions={actions.filter(action => !action.selectAllItems)}
          onClose={hideActionMenu}
        />
      )}
    </Card>
  )
}

GridFile.propTypes = {
  t: PropTypes.func,
  f: PropTypes.func,
  attributes: PropTypes.object.isRequired,
  actions: PropTypes.array,
  isRenaming: PropTypes.bool,
  withSelectionCheckbox: PropTypes.bool.isRequired,
  withFilePath: PropTypes.bool,
  onContextMenu: PropTypes.func,
  /** Disables row actions */
  disabled: PropTypes.bool,
  /** Apply disabled style on row */
  breakpoints: PropTypes.object.isRequired,
  refreshFolderContent: PropTypes.func,
  isInSyncFromSharing: PropTypes.bool,
  extraColumns: extraColumnsPropTypes,
  /** Disables the ability to select a file */
  disableSelection: PropTypes.bool
}

export const DumbGridFile = props => {
  const { t, f } = useI18n()
  const breakpoints = useBreakpoints()

  return <GridFile t={t} f={f} breakpoints={breakpoints} {...props} />
}

export const GridFileWithSelection = props => {
  const isRenaming = useSelector(
    state =>
      isRenamingReducer(state) &&
      get(getRenamingFile(state), 'id') === props.attributes.id
  )

  return <DumbGridFile isRenaming={isRenaming} {...props} />
}
