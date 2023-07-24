import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'
import filesize from 'filesize'
import get from 'lodash/get'

import { isDirectory } from 'cozy-client/dist/models/file'
import { isIOSApp } from 'cozy-device-helper'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { TableRow, TableCell } from 'cozy-ui/transpiled/react/Table'

import { ActionMenuWithHeader } from 'drive/web/modules/actionmenu/ActionMenuWithHeader'
import FileThumbnail from 'drive/web/modules/filelist/FileThumbnail'
import { isRenaming, getRenamingFile } from 'drive/web/modules/drive/rename'
import { isAvailableOffline } from 'drive/mobile/modules/offline/duck'
import FileOpener from 'drive/web/modules/filelist/FileOpener'
import {
  SelectBox,
  FileName,
  LastUpdate,
  Size,
  Status,
  FileAction
} from './cells'
import { extraColumnsPropTypes } from 'drive/web/modules/certifications'

import styles from 'drive/styles/filelist.styl'
import { useSelectionContext } from 'drive/web/modules/selection/SelectionProvider'

const File = ({
  t,
  f,
  attributes,
  actions,
  isRenaming,
  withSelectionCheckbox,
  withFilePath,
  isAvailableOffline,
  disabled,
  styleDisabled,
  thumbnailSizeBig,
  refreshFolderContent,
  isInSyncFromSharing,
  extraColumns,
  breakpoints: { isExtraLarge, isMobile },
  onFolderOpen,
  onFileOpen,
  disableSelection = false
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
    if (window.StatusBar && isIOSApp()) {
      window.StatusBar.backgroundColorByHexString('#989AA0')
    }
    setActionMenuVisible(true)
  }

  const hideActionMenu = () => {
    if (window.StatusBar && isIOSApp()) {
      window.StatusBar.backgroundColorByHexString('#FFFFFF')
    }
    setActionMenuVisible(false)
  }

  const toggle = e => {
    e.stopPropagation()
    toggleSelectedItem(attributes)
  }

  const open = (event, attributes) => {
    event.stopPropagation()
    if (isDirectory(attributes)) {
      onFolderOpen(attributes.id)
    } else {
      onFileOpen({
        event,
        file: attributes,
        isAvailableOffline
      })
    }
  }

  const isImage = attributes.class === 'image'
  const isLargeRow = isImage && thumbnailSizeBig
  const isRowDisabledOrInSyncFromSharing = disabled || isInSyncFromSharing

  const filContentRowSelected = cx(styles['fil-content-row'], {
    [styles['fil-content-row-selected']]: selected,
    [styles['fil-content-row-actioned']]: actionMenuVisible,
    [styles['fil-content-row-disabled']]: styleDisabled,
    [styles['fil-content-row-bigger']]: isLargeRow
  })
  const formattedSize = isDirectory(attributes)
    ? undefined
    : filesize(attributes.size, { base: 10 })

  const updatedAt = attributes.updated_at || attributes.created_at
  const formattedUpdatedAt = f(
    updatedAt,
    isExtraLarge
      ? t('table.row_update_format_full')
      : t('table.row_update_format')
  )

  const selected = isItemSelected(attributes.id)

  return (
    <TableRow className={filContentRowSelected}>
      <SelectBox
        withSelectionCheckbox={withSelectionCheckbox}
        selected={selected}
        onClick={e => toggle(e)}
        disabled={isRowDisabledOrInSyncFromSharing || disableSelection}
      />
      <FileOpener
        file={attributes}
        disabled={isRowDisabledOrInSyncFromSharing}
        actionMenuVisible={actionMenuVisible}
        selectionModeActive={isSelectionBarVisible}
        open={open}
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
            size={isLargeRow ? 96 : undefined}
            isInSyncFromSharing={isInSyncFromSharing}
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
          isAvailableOffline={isAvailableOffline}
          disabled={isRowDisabledOrInSyncFromSharing}
          isInSyncFromSharing={isInSyncFromSharing}
        />
      </FileOpener>
      {actions && (
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
  actions: PropTypes.array.isRequired,
  isRenaming: PropTypes.bool,
  withSelectionCheckbox: PropTypes.bool.isRequired,
  withFilePath: PropTypes.bool,
  isAvailableOffline: PropTypes.bool.isRequired,
  /** Disables row actions */
  disabled: PropTypes.bool,
  /** Apply disabled style on row */
  styleDisabled: PropTypes.bool,
  breakpoints: PropTypes.object.isRequired,
  /** When a user click on a Folder */
  onFolderOpen: PropTypes.func.isRequired,
  /** onFileOpen : When a user click on a File */
  onFileOpen: PropTypes.func.isRequired,
  refreshFolderContent: PropTypes.func,
  isInSyncFromSharing: PropTypes.bool,
  extraColumns: extraColumnsPropTypes,
  /** Disables the ability to select a file */
  disableSelection: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => ({
  isAvailableOffline: isAvailableOffline(state, ownProps.attributes.id),
  isRenaming:
    isRenaming(state) &&
    get(getRenamingFile(state), 'id') === ownProps.attributes.id
})

export const DumbFile = withBreakpoints()(translate()(File))

export const FileWithSelection = connect(mapStateToProps)(DumbFile)
