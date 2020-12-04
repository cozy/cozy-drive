import React, { useState, forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import filesize from 'filesize'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { SharedStatus, ShareModal } from 'cozy-sharing'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import palette from 'cozy-ui/transpiled/react/palette'
import { isIOSApp } from 'cozy-device-helper'
import { TableRow, TableCell } from 'cozy-ui/transpiled/react/Table'

import RenameInput from 'drive/web/modules/drive/RenameInput'

import { ActionMenuWithHeader } from 'drive/web/modules/actionmenu/ActionMenuWithHeader'
import { isDirectory } from 'drive/web/modules/drive/files'
import FileThumbnail from 'drive/web/modules/filelist/FileThumbnail'
import { CozyFile } from 'models'
import {
  toggleItemSelection,
  isSelected
} from 'drive/web/modules/selection/duck'
import { isRenaming, getRenamingFile } from 'drive/web/modules/drive/rename'
import { isAvailableOffline } from 'drive/mobile/modules/offline/duck'
import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import FileOpener from 'drive/web/modules/filelist/FileOpener'

import styles from 'drive/styles/filelist.styl'

import HammerComponent from './HammerComponent'

const getParentDiv = element => {
  if (element.nodeName.toLowerCase() === 'div') {
    return element
  }
  return getParentDiv(element.parentNode)
}

export const getParentLink = element => {
  if (!element) {
    return null
  }

  if (element.nodeName.toLowerCase() === 'a') {
    return element
  }

  return getParentLink(element.parentNode)
}

export const enableTouchEvents = ev => {
  // remove event when you rename a file
  if (['INPUT', 'BUTTON'].indexOf(ev.target.nodeName) !== -1) {
    return false
  }

  const parentDiv = getParentDiv(ev.target)
  // remove event when it's the checkbox or the more button
  if (
    parentDiv.className.indexOf(styles['fil-content-file-select']) !== -1 ||
    parentDiv.className.indexOf(styles['fil-content-file-action']) !== -1
  ) {
    return false
  }

  // remove events when they are on the file's path, because it's a different behavior
  const parentLink = getParentLink(ev.target)
  if (
    parentLink &&
    parentLink.className.indexOf(styles['fil-file-path']) >= 0
  ) {
    return false
  }

  return true
}

const SelectBox = ({ withSelectionCheckbox, selected, onClick, disabled }) => (
  <TableCell
    className={cx(
      styles['fil-content-cell'],
      styles['fil-content-file-select']
    )}
    {...!disabled && { onClick }}
  >
    {withSelectionCheckbox &&
      !disabled && (
        <span data-input="checkbox">
          <input
            onChange={() => {
              // handled by onClick on the <TableCell>
            }}
            type="checkbox"
            checked={selected}
          />
          <label />
        </span>
      )}
  </TableCell>
)

const FileName = ({
  attributes,
  isRenaming,
  interactive,
  withFilePath,
  isMobile,
  formattedSize,
  formattedUpdatedAt,
  refreshFolderContent,
  isInSyncFromSharing
}) => {
  const classes = cx(
    styles['fil-content-cell'],
    styles['fil-content-file'],
    { [styles['fil-content-file-openable']]: !isRenaming && interactive },
    { [styles['fil-content-row-disabled']]: isInSyncFromSharing }
  )
  const { filename, extension } = CozyFile.splitFilename(attributes)

  return (
    <TableCell className={classes}>
      {isRenaming ? (
        <RenameInput
          file={attributes}
          refreshFolderContent={refreshFolderContent}
        />
      ) : (
        <div className={styles['fil-file']}>
          <div className={styles['fil-file-filename']}>
            <div className={styles['fil-file-filename-wrapper']}>
              <div
                data-test-id="fil-file-filename-and-ext"
                className={styles['fil-file-filename-and-ext']}
              >
                {filename}
                {extension && (
                  <span className={styles['fil-content-ext']}>{extension}</span>
                )}
              </div>
            </div>
          </div>
          {withFilePath &&
            attributes.displayedPath &&
            (isMobile ? (
              <MidEllipsis
                className={styles['fil-file-path']}
                text={attributes.displayedPath}
              />
            ) : (
              <Link
                to={`/folder/${attributes.dir_id}`}
                className={styles['fil-file-path']}
              >
                <MidEllipsis text={attributes.displayedPath} />
              </Link>
            ))}
          {!withFilePath &&
            (isDirectory(attributes) || (
              <div className={styles['fil-file-infos']}>
                {`${formattedUpdatedAt}${
                  formattedSize ? ` - ${formattedSize}` : ''
                }`}
              </div>
            ))}
        </div>
      )}
    </TableCell>
  )
}

const _LastUpdate = ({ date, formatted = '—' }) => (
  <TableCell
    className={cx(styles['fil-content-cell'], styles['fil-content-date'])}
  >
    <time dateTime={date}>{formatted}</time>
  </TableCell>
)

const LastUpdate = React.memo(_LastUpdate)
const _Size = ({ filesize = '—' }) => (
  <TableCell
    className={cx(styles['fil-content-cell'], styles['fil-content-size'])}
  >
    {filesize}
  </TableCell>
)

const Size = React.memo(_Size)

const ShareContent = ({
  file,
  setDisplayedModal,
  disabled,
  isInSyncFromSharing
}) => (
  <div
    className={cx(styles['fil-content-sharestatus'], {
      [styles['fil-content-sharestatus--disabled']]: disabled
    })}
  >
    {isInSyncFromSharing ? (
      <span data-testid="fil-content-sharestatus--noAvatar">—</span>
    ) : (
      <HammerComponent
        onClick={() => {
          !disabled && setDisplayedModal(true) // should be only disabled
        }}
      >
        <SharedStatus docId={file.id} />
      </HammerComponent>
    )}
  </div>
)

const Status = ({
  isAvailableOffline,
  file,
  disabled,
  isInSyncFromSharing
}) => {
  const [displayedModal, setDisplayedModal] = useState(false)
  return (
    <>
      {displayedModal && (
        <ShareModal
          document={file}
          documentType="Files"
          sharingDesc={file.name}
          onClose={() => setDisplayedModal(false)}
        />
      )}
      <TableCell
        className={cx(styles['fil-content-cell'], styles['fil-content-status'])}
      >
        {isAvailableOffline &&
          !disabled && (
            <span className={styles['fil-content-offline']}>
              <Icon
                icon="phone-download"
                color={palette.white}
                width="14"
                height="14"
              />
            </span>
          )}
        <ShareContent
          file={file}
          setDisplayedModal={setDisplayedModal}
          disabled={disabled}
          isInSyncFromSharing={isInSyncFromSharing}
        />
      </TableCell>
    </>
  )
}

const FileAction = forwardRef(function FileAction(
  { t, onClick, disabled, isInSyncFromSharing },
  ref
) {
  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-file-action'],
        { [styles['fil-content-file-action--disabled']]: isInSyncFromSharing }
      )}
    >
      <span ref={ref}>
        <Button
          theme="action"
          {...!disabled && { onClick }}
          extension="narrow"
          icon={
            <Icon
              icon="dots"
              color={palette.charcoalGrey}
              width="17"
              height="17"
            />
          }
          iconOnly
          label={t('Toolbar.more')}
        />
      </span>
    </TableCell>
  )
})

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

  const open = (e, attributes) => {
    const { onFolderOpen, onFileOpen, isAvailableOffline } = props
    e.stopPropagation()
    if (isDirectory(attributes)) {
      onFolderOpen(attributes.id)
    } else {
      onFileOpen(attributes, isAvailableOffline)
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
      {actions &&
        actionMenuVisible && (
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
  isInSyncFromSharing: PropTypes.bool
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
