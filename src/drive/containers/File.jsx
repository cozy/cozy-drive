import React, { Component } from 'react'
import classNames from 'classnames'
import filesize from 'filesize'
import { withRouter, Link } from 'react-router'
import Hammer from 'hammerjs'

import styles from '../styles/table'
import { translate } from 'cozy-ui/react/I18n'
import RenameInput from '../ducks/files/RenameInput'
import { isDirectory } from '../ducks/files/files'
import Spinner from 'cozy-ui/react/Spinner'
import { ImageLoader } from 'components/Image'
import { Button, Icon, withBreakpoints, MidEllipsis } from 'cozy-ui/react'
import { SharedBadge, SharedStatus } from 'sharing'
import { getFileTypeFromMime } from 'drive/lib/getFileTypeFromMime'

import { getFolderUrl } from '../reducers'

export const splitFilename = file =>
  isDirectory(file)
    ? { filename: file.name, extension: '' }
    : {
        extension: file.name.slice(file.name.lastIndexOf('.') + 1),
        filename: file.name.slice(0, file.name.lastIndexOf('.') + 1)
      }

export const getClassFromMime = attrs => {
  if (isDirectory(attrs)) {
    return styles['fil-file-folder']
  }

  return styles[
    'fil-file-' +
      (getFileTypeFromMime(styles, 'fil-file-')(attrs.mime) ||
        console.warn(
          `No icon found, you may need to add a mapping for ${attrs.mime}`
        ) ||
        'files')
  ]
}

const getParentDiv = element => {
  if (element.nodeName.toLowerCase() === 'div') {
    return element
  }
  return getParentDiv(element.parentNode)
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
  if (
    ev.target.nodeName.toLowerCase() === 'a' &&
    ev.target.className.indexOf(styles['fil-file-path']) >= 0
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
  opening,
  withFilePath,
  isMobile,
  formattedSize,
  formattedUpdatedAt
}) => {
  const classes = classNames(
    styles['fil-content-cell'],
    styles['fil-content-file'],
    getClassFromMime(attributes),
    { [styles['fil-content-file-openable']]: !isRenaming }
  )
  const { filename, extension } = splitFilename(attributes)
  return (
    <div className={classes}>
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
      <SharedBadge
        docId={attributes.id}
        className={styles['fil-content-shared']}
        xsmall
      />
      {isRenaming ? (
        <RenameInput />
      ) : (
        <div className={styles['fil-file']}>
          <div className={styles['fil-file-filename']}>
            <div className={styles['fil-file-filename-wrapper']}>
              <div className={styles['fil-file-filename-and-ext']}>
                {filename}
                {extension && (
                  <span className={styles['fil-content-ext']}>{extension}</span>
                )}
              </div>
              <div className={styles['fil-file-filename-spinner']}>
                {opening === true && <Spinner />}
              </div>
            </div>
          </div>
          {withFilePath &&
            attributes.path &&
            (isMobile ? (
              <MidEllipsis
                className={styles['fil-file-path']}
                text={attributes.path}
              />
            ) : (
              <Link
                to={`/folder/${attributes.dir_id}`}
                className={styles['fil-file-path']}
              >
                <MidEllipsis text={attributes.path} />
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

const FileAction = ({ onClick }) => (
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
    />
  </div>
)

class File extends Component {
  state = {
    opening: false
  }

  componentDidMount() {
    this.gesturesHandler = new Hammer.Manager(this.filerow)
    this.gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
    this.gesturesHandler.add(new Hammer.Press({ event: 'onpress' }))
    this.gesturesHandler.on('onpress singletap', ev => {
      if (enableTouchEvents(ev)) {
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
    const { attributes, onToggle, selected } = this.props
    onToggle(attributes, selected)
  }

  open(e, attributes) {
    e.stopPropagation()
    if (isDirectory(attributes)) {
      this.setState(state => ({ ...state, opening: true }))
      this.props.onFolderOpen(attributes.id).then(() => {
        this.setState(state => ({ ...state, opening: false }))
        this.props.router.push(getFolderUrl(attributes.id, this.props.location))
      })
    } else {
      this.props.onFileOpen({
        ...attributes,
        availableOffline: this.props.isAvailableOffline
      })
    }
  }

  render() {
    const {
      t,
      f,
      attributes,
      selected,
      selectionModeActive,
      onShowActionMenu,
      isRenaming,
      withSelectionCheckbox,
      withFilePath,
      isAvailableOffline,
      breakpoints: { isExtraLarge, isMobile }
    } = this.props
    const { opening } = this.state
    const filContentRowSelected = classNames(
      styles['fil-content-row'],
      selected ? styles['fil-content-row-selected'] : '',
      { [styles['fil-content-row--selectable']]: selectionModeActive }
    )
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
          opening={opening}
          withFilePath={withFilePath}
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
        <FileAction
          onClick={e => {
            onShowActionMenu(attributes.id)
            e.stopPropagation()
          }}
        />
      </div>
    )
  }
}

export default withBreakpoints()(withRouter(translate()(File)))

export const FilePlaceholder = ({ style }) => (
  <div style={style} className={styles['fil-content-row']}>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file-select']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file']
      )}
    >
      <div className={styles['fil-content-file-placeholder']} />
    </div>
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-date']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-size']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-status']
      )}
    />
    <div
      className={classNames(
        styles['fil-content-cell'],
        styles['fil-content-file-action']
      )}
    />
  </div>
)
