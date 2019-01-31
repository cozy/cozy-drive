import React, { Component } from 'react'
import classNames from 'classnames'
import filesize from 'filesize'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Hammer from 'hammerjs'

import { translate } from 'cozy-ui/react/I18n'
import RenameInput from 'drive/web/modules/drive/RenameInput'
import { default as DesktopActionMenu } from 'drive/web/modules/actionmenu/ActionMenu'
import MobileActionMenu from 'drive/web/modules/actionmenu/MobileActionMenu'
import { isDirectory } from 'drive/web/modules/drive/files'
import { ImageLoader } from 'components/Image'
import { Button, Icon, withBreakpoints, MidEllipsis } from 'cozy-ui/react'
import { SharedBadge, SharedStatus } from 'sharing'
import { getFileMimetype } from 'drive/lib/getFileMimetype'

import {
  toggleItemSelection,
  isSelected
} from 'drive/web/modules/selection/duck'
import { isAvailableOffline } from 'drive/mobile/modules/offline/duck'

import styles from 'drive/styles/filelist.styl'

const ActionMenu = withBreakpoints()(
  ({ breakpoints: { isMobile }, ...props }) =>
    isMobile ? (
      <MobileActionMenu {...props} />
    ) : (
      <DesktopActionMenu {...props} />
    )
)

export const splitFilename = file =>
  isDirectory(file)
    ? { filename: file.name, extension: '' }
    : {
        extension: file.name.slice(file.name.lastIndexOf('.')),
        filename: file.name.slice(0, file.name.lastIndexOf('.'))
      }

export const getClassFromMime = attrs => {
  if (isDirectory(attrs)) {
    return styles['fil-file-folder']
  }
  return styles[
    'fil-file-' +
      (getFileMimetype(styles, 'fil-file-')(attrs.mime, attrs.name) || 'files')
  ]
}

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

const enableTouchEvents = ev => {
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
        <input type="checkbox" checked={selected} />
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
  withSharedBadge,
  isMobile,
  formattedSize,
  formattedUpdatedAt
}) => {
  const classes = classNames(
    styles['fil-content-cell'],
    styles['fil-content-file'],
    getClassFromMime(attributes),
    { [styles['fil-content-file-openable']]: !isRenaming && interactive }
  )
  const { filename, extension } = splitFilename(attributes)
  return (
    <div className={classes}>
      {attributes.class === 'image' && (
        <ImageLoader
          file={attributes}
          size="small"
          render={src => (
            <div
              className={styles['fil-file-preview']}
              style={`background-image: url(${src});`}
            />
          )}
        />
      )}
      {withSharedBadge && (
        <SharedBadge
          docId={attributes.id}
          className={styles['fil-content-shared']}
          xsmall
        />
      )}
      {isRenaming ? (
        <RenameInput />
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
        <Icon icon="phone-download" color="white" width="14" height="14" />
      </span>
    )}
    <SharedStatus docId={id} className={styles['fil-content-sharestatus']} />
  </div>
)

const FileAction = ({ t, onClick }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-file-action']
    )}
  >
    <Button
      theme="action"
      onClick={onClick}
      extension="narrow"
      icon={<Icon icon="dots" color="charcoalGrey" width="17" height="17" />}
      iconOnly
      label={t('Toolbar.more')}
    />
  </div>
)

class File extends Component {
  state = {
    actionMenuVisible: false
  }

  showActionMenu = () => {
    this.setState(state => ({ ...state, actionMenuVisible: true }))
  }

  hideActionMenu = () => {
    this.setState(state => ({ ...state, actionMenuVisible: false }))
  }

  componentDidMount() {
    this.gesturesHandler = new Hammer.Manager(this.filerow)
    this.gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
    this.gesturesHandler.add(new Hammer.Press({ event: 'onpress' }))
    this.gesturesHandler.on('onpress singletap', ev => {
      if (this.state.actionMenuVisible || this.props.disabled) return
      if (enableTouchEvents(ev)) {
        ev.preventDefault() // prevent a ghost click
        if (ev.type === 'onpress' || this.props.selectionModeActive) {
          this.toggle(ev.srcEvent)
        } else {
          this.open(ev.srcEvent, this.props.attributes)
        }
      }
    })
  }

  componentWillUnmount() {
    this.gesturesHandler.destroy()
  }

  toggle(e) {
    e.stopPropagation()
    const { attributes, onCheckboxToggle, selected } = this.props
    onCheckboxToggle(attributes.id, selected)
  }

  open(e, attributes) {
    e.stopPropagation()
    if (isDirectory(attributes)) {
      this.props.onFolderOpen(attributes.id)
    } else {
      this.props.onFileOpen(attributes, this.props.isAvailableOffline)
    }
  }

  render() {
    const {
      t,
      f,
      attributes,
      selected,
      actions,
      isRenaming,
      withSelectionCheckbox,
      withFilePath,
      withSharedBadge,
      isAvailableOffline,
      disabled,
      breakpoints: { isExtraLarge, isMobile }
    } = this.props
    const { actionMenuVisible } = this.state
    const filContentRowSelected = classNames(styles['fil-content-row'], {
      [styles['fil-content-row-selected']]: selected,
      [styles['fil-content-row-actioned']]: actionMenuVisible,
      [styles['fil-content-row-disabled']]: disabled
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
      <div
        ref={filerow => {
          this.filerow = filerow
        }}
        className={filContentRowSelected}
      >
        <SelectBox
          withSelectionCheckbox={withSelectionCheckbox}
          selected={selected}
          onClick={e => this.toggle(e)}
        />
        <FileName
          attributes={attributes}
          isRenaming={isRenaming}
          interactive={!disabled}
          withFilePath={withFilePath}
          withSharedBadge={withSharedBadge}
          isMobile={isMobile}
          formattedSize={formattedSize}
          formattedUpdatedAt={formattedUpdatedAt}
        />
        <LastUpdate
          date={updatedAt}
          formatted={isDirectory(attributes) ? undefined : formattedUpdatedAt}
        />
        <Size filesize={formattedSize} />
        <Status id={attributes.id} isAvailableOffline={isAvailableOffline} />
        {actions && (
          <FileAction
            t={t}
            ref={toggle => {
              this.filerowMenuToggle = toggle
            }}
            onClick={e => {
              this.showActionMenu()
              e.stopPropagation()
            }}
          />
        )}
        {actions &&
          actionMenuVisible && (
            <ActionMenu
              file={attributes}
              reference={this.filerowMenuToggle}
              actions={actions}
              onClose={this.hideActionMenu}
            />
          )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  selected: isSelected(state, ownProps.attributes.id),
  isAvailableOffline: isAvailableOffline(state, ownProps.attributes.id)
})

const mapDispatchToProps = dispatch => ({
  onCheckboxToggle: (file, selected) =>
    dispatch(toggleItemSelection(file, selected))
})

export const DumbFile = withBreakpoints()(translate()(File))

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DumbFile)
