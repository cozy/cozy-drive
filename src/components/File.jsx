import React, { Component } from 'react'
import classNames from 'classnames'
import filesize from 'filesize'
import { withRouter } from 'react-router'
import Hammer from 'hammerjs'

import styles from '../styles/table'
import { translate } from '../lib/I18n'
import RenameInput from '../ducks/files/RenameInput'

import { getFolderUrl } from '../reducers'

export const splitFilename = filename => {
  const dotIdx = filename.lastIndexOf('.') - 1 >>> 0
  return {
    extension: filename.slice(dotIdx + 1),
    filename: filename.slice(0, dotIdx + 1)
  }
}

const isDir = attrs => attrs.type === 'directory'

export const getClassFromMime = (attrs) => {
  if (isDir(attrs)) {
    return styles['fil-file-folder']
  }
  return styles['fil-file-' + attrs.mime.split('/')[0]] || styles['fil-file-files']
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
    this.gesturesHandler.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }))
    this.gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
    this.gesturesHandler.add(new Hammer.Press({ event: 'onpress' }))
    this.gesturesHandler.get('doubletap').recognizeWith('singletap').requireFailure('onpress')
    this.gesturesHandler.get('singletap').requireFailure('doubletap').requireFailure('onpress')
    this.gesturesHandler.on('onpress singletap doubletap', (ev) => {
      const enableTouchEvents = ev => ['INPUT', 'BUTTON', 'LABEL'].indexOf(ev.target.nodeName) === -1
      if (enableTouchEvents(ev)) {
        if (ev.type === 'onpress' || (this.props.selectionModeActive && ev.type === 'singletap')) {
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
    if (isDir(attributes)) {
      this.setState({ opening: true })
      this.props.onFolderOpen(attributes.id).then(() => {
        this.setState({ opening: false })
        this.props.router.push(getFolderUrl(attributes.id, this.props.location))
      })
    } else {
      this.props.onFileOpen(this.props.displayedFolder, attributes)
    }
  }

  render ({ t, f, style, attributes, selected, selectionModeActive, onShowActionMenu, isRenaming }, { opening }) {
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
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])}>
          <span data-input='checkbox'>
            <input
              type='checkbox'
              checked={selected}
             />
            <label onClick={e => this.toggle(e)} />
          </span>
        </div>
        {this.renderFilenameCell(attributes, opening, isRenaming)}
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-date'])}>
          <time datetime=''>{ f(attributes.created_at, 'MMM D, YYYY') }</time>
        </div>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-size'])}>
          {isDir(attributes)
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

  renderFilenameCell (attributes, opening, isRenaming) {
    const classes = classNames(
      styles['fil-content-cell'],
      styles['fil-content-file'],
      getClassFromMime(attributes),
      { [styles['fil-content-file-openable']]: !isRenaming }
    )
    const { filename, extension } = splitFilename(attributes.name)
    return (
      <div className={classes}>
        {isRenaming
          ? <RenameInput />
          : <div>
            {filename}
            {extension && <span className={styles['fil-content-ext']}>{extension}</span>}
            {opening === true && <div className={styles['fil-loading']} />}
          </div>
        }
      </div>
    )
  }
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
