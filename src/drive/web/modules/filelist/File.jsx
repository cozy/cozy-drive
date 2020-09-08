import React, { useState, forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import filesize from 'filesize'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { SharedStatus } from 'cozy-sharing'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import palette from 'cozy-ui/transpiled/react/palette'

import RenameInput from 'drive/web/modules/drive/RenameInput'
import { default as DesktopActionMenu } from 'drive/web/modules/actionmenu/ActionMenu'
import MobileActionMenu from 'drive/web/modules/actionmenu/MobileActionMenu'
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

const ActionMenu = withBreakpoints()(
  ({ breakpoints: { isMobile }, ...props }) =>
    isMobile ? (
      <MobileActionMenu {...props} />
    ) : (
      <DesktopActionMenu {...props} />
    )
)

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

const SelectBox = ({ withSelectionCheckbox, selected, onClick }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-file-select']
    )}
    onClick={onClick}
  >
    {withSelectionCheckbox && (
      <span data-input="checkbox">
        <input
          onChange={() => {
            // handled by onClick on the <div>
          }}
          type="checkbox"
          checked={selected}
        />
        <label />
      </span>
    )}
  </div>
)

const FileName = ({
  attributes,
  isRenaming,
  interactive,
  withFilePath,
  isMobile,
  formattedSize,
  formattedUpdatedAt,
  refreshFolderContent
}) => {
  const classes = classNames(
    styles['fil-content-cell'],
    styles['fil-content-file'],
    { [styles['fil-content-file-openable']]: !isRenaming && interactive }
  )
  const { filename, extension } = CozyFile.splitFilename(attributes)

  return (
    <div className={classes}>
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
    </div>
  )
}

const LastUpdate = ({ date, formatted = '-' }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-date']
    )}
  >
    <time dateTime={date}>{formatted}</time>
  </div>
)

const Size = ({ filesize = '-' }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-size']
    )}
  >
    {filesize}
  </div>
)

const Status = ({ isAvailableOffline, id }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-status']
    )}
  >
    {isAvailableOffline && (
      <span className={styles['fil-content-offline']}>
        <Icon
          icon="phone-download"
          color={palette.white}
          width="14"
          height="14"
        />
      </span>
    )}
    <SharedStatus docId={id} className={styles['fil-content-sharestatus']} />
  </div>
)

const FileAction = forwardRef(({ t, onClick }, ref) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-file-action']
    )}
    ref={ref}
  >
    <Button
      theme="action"
      onClick={onClick}
      extension="narrow"
      icon={
        <Icon icon="dots" color={palette.charcoalGrey} width="17" height="17" />
      }
      iconOnly
      label={t('Toolbar.more')}
    />
  </div>
))

const File = props => {
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const filerowMenuToggleRef = useRef()

  const showActionMenu = () => {
    setActionMenuVisible(true)
  }

  const hideActionMenu = () => {
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
    thumbnailSizeBig,
    selectionModeActive,
    refreshFolderContent,
    breakpoints: { isExtraLarge, isMobile }
  } = props

  const isImage = attributes.class === 'image'
  const isLargeRow = isImage && thumbnailSizeBig

  const filContentRowSelected = classNames(styles['fil-content-row'], {
    [styles['fil-content-row-selected']]: selected,
    [styles['fil-content-row-actioned']]: actionMenuVisible,
    [styles['fil-content-row-disabled']]: disabled,
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
    <div className={filContentRowSelected}>
      <SelectBox
        withSelectionCheckbox={withSelectionCheckbox}
        selected={selected}
        onClick={e => toggle(e)}
      />
      <FileOpener
        file={attributes}
        disabled={disabled}
        actionMenuVisible={actionMenuVisible}
        selectionModeActive={selectionModeActive}
        open={open}
        toggle={toggle}
        isRenaming={isRenaming}
      >
        <FileThumbnail file={attributes} size={isLargeRow ? 96 : undefined} />
        <FileName
          attributes={attributes}
          isRenaming={isRenaming}
          interactive={!disabled}
          withFilePath={withFilePath}
          isMobile={isMobile}
          formattedSize={formattedSize}
          formattedUpdatedAt={formattedUpdatedAt}
          refreshFolderContent={refreshFolderContent}
        />
        <LastUpdate
          date={updatedAt}
          formatted={isDirectory(attributes) ? undefined : formattedUpdatedAt}
        />
        <Size filesize={formattedSize} />
        <Status id={attributes.id} isAvailableOffline={isAvailableOffline} />
      </FileOpener>
      {actions && (
        <FileAction
          t={t}
          ref={filerowMenuToggleRef}
          onClick={e => {
            showActionMenu()
            e.stopPropagation()
          }}
        />
      )}
      {actions &&
        actionMenuVisible && (
          <ActionMenu
            file={attributes}
            reference={filerowMenuToggleRef.current}
            actions={actions}
            onClose={hideActionMenu}
          />
        )}
    </div>
  )
}

File.propTypes = {
  t: PropTypes.func,
  f: PropTypes.func,
  attributes: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  isRenaming: PropTypes.bool,
  withSelectionCheckbox: PropTypes.bool.isRequired,
  withFilePath: PropTypes.bool,
  isAvailableOffline: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  breakpoints: PropTypes.object.isRequired,
  selectionModeActive: PropTypes.bool.isRequired,
  /** When a user click on a Folder */
  onFolderOpen: PropTypes.func.isRequired,
  /** onFileOpen : When a user click on a File */
  onFileOpen: PropTypes.func.isRequired,
  onCheckboxToggle: PropTypes.func.isRequired,
  refreshFolderContent: PropTypes.func
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
