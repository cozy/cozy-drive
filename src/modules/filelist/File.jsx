import cx from 'classnames'
import { filesize } from 'filesize'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'

import { isDirectory } from 'cozy-client/dist/models/file'
import { TableRow, TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  SelectBox,
  FileName,
  LastUpdate,
  Size,
  Status,
  FileAction,
  SharingShortcutBadge
} from './cells'

import styles from '@/styles/filelist.styl'

import { ActionMenuWithHeader } from '@/modules/actionmenu/ActionMenuWithHeader'
import { extraColumnsPropTypes } from '@/modules/certifications'
import { isRenaming, getRenamingFile } from '@/modules/drive/rename'
import FileOpener from '@/modules/filelist/FileOpener'
import FileThumbnail from '@/modules/filelist/icons/FileThumbnail'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const File = ({
  t,
  f,
  attributes,
  actions,
  isRenaming,
  withSelectionCheckbox,
  withFilePath,
  disabled,
  styleDisabled,
  thumbnailSizeBig,
  refreshFolderContent,
  isInSyncFromSharing,
  extraColumns,
  breakpoints: { isExtraLarge, isMobile },
  disableSelection = false,
  canInteractWith
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

  const filContentRowSelected = cx(styles['fil-content-row'], {
    [styles['fil-content-row-selected']]: selected,
    [styles['fil-content-row-actioned']]: actionMenuVisible,
    [styles['fil-content-row-disabled']]: styleDisabled,
    [styles['fil-content-row-bigger']]: thumbnailSizeBig
  })

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

  const selected = isItemSelected(attributes.id)

  // We don't allow any action on shared drives and trash
  // because they are magic folder created by the stack
  let canInteractWithFile =
    attributes._id !== 'io.cozy.files.shared-drives-dir' &&
    !attributes._id.endsWith('.trash-dir')
  if (typeof canInteractWith === 'function') {
    canInteractWithFile &&= canInteractWith(attributes)
  }

  return (
    <TableRow className={filContentRowSelected}>
      <SelectBox
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
        <TableCell
          className={cx(
            styles['fil-content-cell'],
            styles['fil-file-thumbnail'],
            {
              'u-pl-0': !isMobile
            }
          )}
        >
          <FileThumbnail
            file={attributes}
            size={thumbnailSizeBig ? 96 : undefined}
            isInSyncFromSharing={isInSyncFromSharing}
            showSharedBadge={isMobile}
            componentsProps={{
              sharedBadge: {
                className: styles['fil-content-shared']
              }
            }}
          />
        </TableCell>
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
        <LastUpdate
          date={updatedAt}
          formatted={isDirectory(attributes) ? undefined : formattedUpdatedAt}
        />
        <Size filesize={formattedSize} />
        {extraColumns &&
          extraColumns.map(column => (
            <column.CellComponent key={column.label} file={attributes} />
          ))}
        <Status
          file={attributes}
          disabled={isRowDisabledOrInSyncFromSharing}
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
          actions={actions}
          onClose={hideActionMenu}
        />
      )}
    </TableRow>
  )
}

File.propTypes = {
  t: PropTypes.func,
  f: PropTypes.func,
  attributes: PropTypes.object.isRequired,
  actions: PropTypes.array,
  isRenaming: PropTypes.bool,
  withSelectionCheckbox: PropTypes.bool.isRequired,
  withFilePath: PropTypes.bool,
  /** Disables row actions */
  disabled: PropTypes.bool,
  /** Apply disabled style on row */
  styleDisabled: PropTypes.bool,
  breakpoints: PropTypes.object.isRequired,
  refreshFolderContent: PropTypes.func,
  isInSyncFromSharing: PropTypes.bool,
  extraColumns: extraColumnsPropTypes,
  /** Disables the ability to select a file */
  disableSelection: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => ({
  isRenaming:
    isRenaming(state) &&
    get(getRenamingFile(state), 'id') === ownProps.attributes.id
})

export const DumbFile = withBreakpoints()(translate()(File))

export const FileWithSelection = connect(mapStateToProps)(DumbFile)
