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
function togleCheckboxBetweenTwoNodes(node1, node2) {
  var commonNode = node1.parentNode
  var checkboxToTogle = []
  var hasFindCheckbox = false

  // Parcours de tous les descendants de commonNode
  for (var i = 0; i < commonNode.children.length; i++) {
    var child = commonNode.children[i]
    // Si on trouve le premier noeud, on commence à chercher les cases à cocher
    if (child === node1 || child === node2) {
      if (hasFindCheckbox) {
        break // On a trouvé le deuxième noeud, on arrête de chercher
      }
      hasFindCheckbox = true // On a trouvé le premier noeud, on commence à chercher
    } else if (hasFindCheckbox) {
      const toAdd = child.querySelector('.fil-content-file-select--3xRxR')
      checkboxToTogle.push(toAdd) // On a trouvé une case à cocher, on l'ajoute à la liste
    }
  }
  // Cocher toutes les cases à cocher trouvées
  checkboxToTogle.forEach(function (checkbox) {
    checkbox.click()
  })
}

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
    const { onFolderOpen, onFileOpen, isAvailableOffline } = props
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
    breakpoints: { isExtraLarge, isMobile }
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
        onClick={e => {
          if (e.shiftKey) {
            // fil-content-row c'est le même fichier,
            // donc on peut faire une ref sur TableRow, ça devrait le faire
            const fileLine = e.currentTarget.closest(
              'div.fil-content-row--3tUJY'
            )
            // Je me demande si l'idée, ne serait pas soit de filer en props un tableau
            // de ref venant de FolderViewBody. Soit on remonte dans le folderViewBody le click ?
            // ou alors un calback ?
            const previousSelectedElements =
              fileLine.parentNode.querySelectorAll(
                '.fil-content-row-selected--2YE0h'
              )
            const lastSelectedElement =
              previousSelectedElements[previousSelectedElements.length - 1]
            togleCheckboxBetweenTwoNodes(lastSelectedElement, fileLine)
          }
          return toggle(e)
        }}
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
