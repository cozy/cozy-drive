/* global cozy */
import React, { Component } from 'react'
import classNames from 'classnames'
import filesize from 'filesize'
import { withRouter } from 'react-router'
import Hammer from 'hammerjs'

import styles from '../styles/table'
import { translate } from 'cozy-ui/react/I18n'
import RenameInput from '../ducks/files/RenameInput'
import { isDirectory } from '../ducks/files/files'
import Spinner from 'cozy-ui/react/Spinner'
import Preview from '../components/Preview'

import { getFolderUrl } from '../reducers'

export const splitFilename = file => isDirectory(file)
  ? { filename: file.name, extension: '' }
  : {
    extension: file.name.slice(file.name.lastIndexOf('.') + 1),
    filename: file.name.slice(0, file.name.lastIndexOf('.') + 1)
  }

export const getClassFromMime = (attrs) => {
  if (isDirectory(attrs)) {
    return styles['fil-file-folder']
  }
  return styles['fil-file-' + attrs.mime.split('/')[0]] || styles['fil-file-files']
}

const getClassDiv = element => {
  if (element.nodeName === 'DIV') {
    return element.className
  }
  return getClassDiv(element.parentNode)
}

const enableTouchEvents = ev => {
  // remove event when you rename a file
  if (['INPUT', 'BUTTON'].indexOf(ev.target.nodeName) !== -1) {
    return false
  }

  // remove event when it's checkbox (it's already trigger, but Hammer don't respect stopPropagation)
  if (getClassDiv(ev.target).indexOf(styles['fil-content-file-select']) !== -1) {
    return false
  }

  return true
}

class File extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opening: false
    }
  }

  componentDidMount () {
    this.gesturesHandler = new Hammer.Manager(this.fil)
    this.gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
    this.gesturesHandler.add(new Hammer.Press({ event: 'onpress' }))
    this.gesturesHandler.on('onpress singletap', (ev) => {
      if (enableTouchEvents(ev)) {
        if (ev.type === 'onpress' || this.props.selectionModeActive) {
          this.toggle(ev.srcEvent)
        } else {
          this.open(ev.srcEvent, this.props.attributes)
        }
      }
    })
  }

  componentWillUnmount () {
    this.gesturesHandler.destroy()
  }

  toggle (e) {
    e.stopPropagation()
    const { attributes, onToggle, selected } = this.props
    onToggle(attributes, selected)
  }

  open (e, attributes) {
    e.stopPropagation()
    if (isDirectory(attributes)) {
      this.setState({ opening: true })
      this.props.onFolderOpen(attributes.id).then(() => {
        this.setState({ opening: false })
        this.props.router.push(getFolderUrl(attributes.id, this.props.location))
      })
    } else {
      this.props.onFileOpen(this.props.displayedFolder, attributes)
    }
  }

  render ({ t, f, style, attributes, selected, selectionModeActive, onShowActionMenu, isRenaming, withSelectionCheckbox }, { opening }) {
    return (
      <div
        ref={fil => { this.fil = fil }}
        style={style}
        className={classNames(
          styles['fil-content-row'],
          selected ? styles['fil-content-row-selected'] : '',
          { [styles['fil-content-row--selectable']]: selectionModeActive }
        )}
      >
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])} onclick={(e) => this.toggle(e)}>
          {withSelectionCheckbox &&
            <span data-input='checkbox'>
              <input
                type='checkbox'
                checked={selected}
              />
              <label />
            </span>
          }
        </div>
        <FileNameCell attributes={attributes} isRenaming={isRenaming} opening={opening} />
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-date'])}>
          <time datetime=''>{ f(attributes.created_at, t('table.row_update_format')) }</time>
        </div>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-size'])}>
          {isDirectory(attributes)
            ? '—'
            : filesize(attributes.size, {base: 10})}
        </div>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-status'])}>—</div>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-action'])}>
          <button className='coz-btn coz-btn--extra' onClick={(e) => {
            onShowActionMenu(attributes.id)
            e.stopPropagation()
          }} />
        </div>
      </div>
    )
  }
}

const FileNameCell = ({ attributes, isRenaming, opening }) => {
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
      { attributes.links && <Preview thumbnail={`${url}${attributes.links.small}`} /> }
      {isRenaming
        ? <RenameInput />
        : <div>
          {filename}
          {extension && <span className={styles['fil-content-ext']}>{extension}</span>}
          {opening === true && <Spinner />}
        </div>
      }
    </div>
  )
}

export default withRouter(translate()(File))

export const FilePlaceholder = ({ style }) => (
  <div
    style={style}
    className={styles['fil-content-row']}
  >
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])} />
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-file'])}>
      <div className={styles['fil-content-file-placeholder']} />
    </div>
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-date'])} />
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-size'])} />
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-status'])} />
    <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-action'])} />
  </div>
)
