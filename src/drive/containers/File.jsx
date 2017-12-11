/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import filesize from 'filesize'
import { withRouter, Link } from 'react-router'
import Hammer from 'hammerjs'

import styles from '../styles/table'
import { translate } from 'cozy-ui/react/I18n'
import RenameInput from '../ducks/files/RenameInput'
import { isDirectory } from '../ducks/files/files'
import Spinner from 'cozy-ui/react/Spinner'
import Preview from '../components/Preview'
import { withBreakpoints } from 'cozy-ui/react'
import { SharedBadge } from 'sharing'
import { getSharingDetails } from 'cozy-client'

import { getFolderUrl } from '../reducers'

export const splitFilename = file =>
  isDirectory(file)
    ? { filename: file.name, extension: '' }
    : {
        extension: file.name.slice(file.name.lastIndexOf('.') + 1),
        filename: file.name.slice(0, file.name.lastIndexOf('.') + 1)
      }

const mappingMimetypeSubtype = {
  word: 'text',
  zip: 'zip',
  pdf: 'pdf',
  spreadsheet: 'sheet',
  excel: 'sheet',
  presentation: 'slide',
  powerpoint: 'slide'
}

export const getTypeFromMimeType = (collection, prefix = '') => mimetype => {
  const [type, subtype] = mimetype.split('/')
  if (collection[prefix + type]) {
    return type
  }
  if (type === 'application') {
    const existingType = subtype.match(
      Object.keys(mappingMimetypeSubtype).join('|')
    )
    return existingType ? mappingMimetypeSubtype[existingType[0]] : undefined
  }
  return undefined
}

export const getClassFromMime = attrs => {
  if (isDirectory(attrs)) {
    return styles['fil-file-folder']
  }

  return styles[
    'fil-file-' +
      (getTypeFromMimeType(styles, 'fil-file-')(attrs.mime) ||
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

  // remove event when it's checkbox (it's already trigger, but Hammer don't respect stopPropagation)
  if (
    getParentDiv(ev.target).className.indexOf(
      styles['fil-content-file-select']
    ) !== -1
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
  shared
}) => {
  const classes = classNames(
    styles['fil-content-cell'],
    styles['fil-content-file'],
    getClassFromMime(attributes),
    { [styles['fil-content-file-openable']]: !isRenaming }
  )
  const { filename, extension } = splitFilename(attributes)
  const url = cozy.client._url
  return (
    <div className={classes}>
      {attributes.links &&
        attributes.links.small && (
          <Preview thumbnail={`${url}${attributes.links.small}`} />
        )}
      {(shared.byMe || shared.withMe) && (
        <SharedBadge
          byMe={shared.byMe}
          className={styles['fil-content-shared']}
          xsmall
        />
      )}
      {isRenaming ? (
        <RenameInput />
      ) : (
        <div className={styles['fil-file']}>
          <div className={styles['fil-file-filename']}>
            {filename}
            {extension && (
              <span className={styles['fil-content-ext']}>{extension}</span>
            )}
            {opening === true && <Spinner />}
          </div>
          {withFilePath &&
            (isMobile ? (
              <div className={styles['fil-file-path']}>{attributes.path}</div>
            ) : (
              <Link
                to={`/folder/${attributes.dir_id}`}
                className={styles['fil-file-path']}
              >
                {attributes.path}
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}

const LastUpdate = ({ date, format, f }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-date']
    )}
  >
    <time dateTime={date}>{f(date, format)}</time>
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

const Status = ({ isAvailableOffline, shareStatus }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-status']
    )}
  >
    {isAvailableOffline && <span className={styles['fil-content-offline']} />}
    <span className={styles['fil-content-sharestatus']}>{shareStatus}</span>
  </div>
)

const FileAction = ({ onClick }) => (
  <div
    className={classNames(
      styles['fil-content-cell'],
      styles['fil-content-file-action']
    )}
  >
    <button
      className={classNames(styles['c-btn'], styles['c-btn-extra'])}
      onClick={onClick}
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
      const viewPath = this.props.location.pathname
      if (this.props.isAvailableOffline) {
        this.props.onFileOpen({
          ...attributes,
          availableOffline: this.props.isAvailableOffline
        })
      } else if (viewPath === '/recent' || viewPath === '/trash') {
        this.props.onFileOpen({ ...attributes })
      } else {
        this.props.router.push(`${viewPath}/file/${attributes.id}`)
      }
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
      shared,
      breakpoints: { isExtraLarge, isMobile }
    } = this.props
    const { opening } = this.state
    const filContentRowSelected = classNames(
      styles['fil-content-row'],
      selected ? styles['fil-content-row-selected'] : '',
      { [styles['fil-content-row--selectable']]: selectionModeActive }
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
          shared={shared}
        />
        <LastUpdate
          date={attributes.updated_at || attributes.created_at}
          format={`${
            isExtraLarge
              ? t('table.row_update_format_full')
              : t('table.row_update_format')
          }`}
          f={f}
        />
        <Size
          filesize={
            isDirectory(attributes)
              ? undefined
              : filesize(attributes.size, { base: 10 })
          }
        />
        <Status
          isAvailableOffline={isAvailableOffline}
          shareStatus={
            !shared.shared
              ? '—'
              : shared.byMe
                ? `${t('Files.share.sharedByMe')} (${t(
                    `Share.type.${shared.sharingType}`
                  )})`
                : t('Files.share.sharedWithMe')
          }
        />
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

export default withBreakpoints()(
  withRouter(
    translate()(
      connect((state, ownProps) => ({
        shared: getSharingDetails(
          state,
          'io.cozy.files',
          ownProps.attributes.id
        )
      }))(File)
    )
  )
)

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
