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
import { TableRow } from 'cozy-ui/transpiled/react/Table'

import { ActionMenuWithHeader } from 'drive/web/modules/actionmenu/ActionMenuWithHeader'
import FileThumbnail from 'drive/web/modules/filelist/FileThumbnail'
import {
  toggleItemSelection,
  isSelected,
  isSelectionBarVisible
} from 'drive/web/modules/selection/duck'
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

const File = props => {
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const filerowMenuToggleRef = useRef()

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
    const { attributes, onCheckboxToggle, selected } = props
    onCheckboxToggle(attributes, selected)
  }

  const open = (event, attributes) => {
    const {
      onFolderOpen,
      onFileOpen,
      isAvailableOffline,
      folderUrlToNavigate
    } = props
    event.stopPropagation()
    if (isDirectory(attributes)) {
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        const openInNewTab = url => window.open(url, '_blank')
        const folderUrl =
          folderUrlToNavigate(attributes.id) || `/folder/${attributes.id}`
        openInNewTab(`/#${folderUrl}`)
      } else {
        onFolderOpen(attributes.id)
      }
    } else {
      onFileOpen({
        event,
        file: attributes,
        isAvailableOffline
      })
    }
  }

  const {
    t,
    f,
    attributes,
    selected,
    actions,
    isRenaming,
    withSelectionCheckbox,
    withFilePath,
    isAvailableOffline,
    disabled,
    styleDisabled,
    thumbnailSizeBig,
    selectionModeActive,
    refreshFolderContent,
    isInSyncFromSharing,
    extraColumns,
    breakpoints: { isExtraLarge, isMobile },
    fileUrlToNavigate,
    folderUrlToNavigate
  } = props

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
  return (
    <TableRow className={filContentRowSelected}>
      <SelectBox
        withSelectionCheckbox={withSelectionCheckbox}
        selected={selected}
        onClick={e => toggle(e)}
        disabled={isRowDisabledOrInSyncFromSharing}
      />
      <FileOpener
        file={attributes}
        disabled={isRowDisabledOrInSyncFromSharing}
        actionMenuVisible={actionMenuVisible}
        selectionModeActive={selectionModeActive}
        open={open}
        toggle={toggle}
        isRenaming={isRenaming}
        fileUrlToNavigate={fileUrlToNavigate}
        folderUrlToNavigate={folderUrlToNavigate}
      >
        <FileThumbnail
          file={attributes}
          size={isLargeRow ? 96 : undefined}
          isInSyncFromSharing={isInSyncFromSharing}
        />
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
          folderUrlToNavigate={folderUrlToNavigate}
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
  selected: PropTypes.bool.isRequired,
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
  selectionModeActive: PropTypes.bool.isRequired,
  /** When a user click on a Folder */
  onFolderOpen: PropTypes.func.isRequired,
  /** onFileOpen : When a user click on a File */
  onFileOpen: PropTypes.func.isRequired,
  onCheckboxToggle: PropTypes.func.isRequired,
  refreshFolderContent: PropTypes.func,
  isInSyncFromSharing: PropTypes.bool,
  extraColumns: extraColumnsPropTypes
}

const mapStateToProps = (state, ownProps) => ({
  selected: isSelected(state, ownProps.attributes),
  isAvailableOffline: isAvailableOffline(state, ownProps.attributes.id),
  selectionModeActive: isSelectionBarVisible(state),
  isRenaming:
    isRenaming(state) &&
    get(getRenamingFile(state), 'id') === ownProps.attributes.id
})

const mapDispatchToProps = dispatch => ({
  onCheckboxToggle: (file, selected) =>
    dispatch(toggleItemSelection(file, selected))
})

export const DumbFile = withBreakpoints()(translate()(File))

export const FileWithSelection = connect(
  mapStateToProps,
  mapDispatchToProps
)(DumbFile)
