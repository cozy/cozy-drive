import React, { Component } from 'react'
import classNames from 'classnames'
import filesize from 'filesize'

import styles from '../styles/table'
import { translate } from '../lib/I18n'
import FilenameInput from '../components/FilenameInput'

// Temporary
const STACK_URL = 'http://cozy.local:8080'

export const splitFilename = filename => {
  let dotIdx = filename.lastIndexOf('.') - 1 >>> 0
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
      editing: false,
      opening: false
    }
  }

  edit (value) {
    this.props.onEdit(value, this.props.attributes)
    this.setState({
      editing: false
    })
  }

  abortEdit (accidental) {
    this.props.onEditAbort(accidental, this.props.attributes)
    this.setState({
      editing: false
    })
  }

  toggle (e) {
    e.stopPropagation()
    const { attributes, onToggle } = this.props
    onToggle(attributes.id, attributes.selected)
  }

  open (e, id, isDir = false) {
    e.stopPropagation()
    if (isDir) {
      this.setState({ opening: true })
      this.props.onOpen(id).then(() => this.setState({ opening: false }))
    } else {
      // TODO Handle files opening throught the app instead of doing it throught the browser
      window.open(`${STACK_URL}/files/download/${id}`, '_blank')
    }
  }

  render ({ t, f, attributes, showSelection, onShowActionMenu }, { editing, opening }) {
    const isDirectory = isDir(attributes)
    const rowListeners = showSelection
    ? { onClick: e => this.toggle(e) }
    : { onDoubleClick: e => this.open(e, attributes.id, isDirectory) }
    return (
      <div className={styles['fil-content-row']} {...rowListeners}>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])}>
          <span data-input='checkbox'>
            <input
              type='checkbox'
              checked={attributes.selected}
             />
            <label onClick={e => this.toggle(e)} />
          </span>
        </div>
        {this.renderFilenameCell(attributes, editing, opening, !showSelection)}
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-date'])}>
          <time datetime=''>{ f(attributes.created_at, 'MMM D, YYYY') }</time>
        </div>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-size'])}>
          {isDir(attributes)
            ? '-'
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

  renderFilenameCell (attributes, editing, opening, canOpen) {
    const isDirectory = isDir(attributes)
    const { filename, extension } = splitFilename(attributes.name)
    const classes = classNames(
      styles['fil-content-cell'],
      styles['fil-content-file'],
      getClassFromMime(attributes),
      { [styles['fil-content-file-openable']]: canOpen }
    )
    if (editing) {
      return (
        <div className={classes}>
          <FilenameInput name={attributes.name} error={attributes.creationError} onSubmit={val => this.edit(val)} onAbort={accidental => this.abortEdit(accidental)} />
        </div>
      )
    }
    return (
      <div className={classes} onClick={canOpen ? e => this.open(e, attributes.id, isDirectory) : undefined}>
        {filename}
        {extension && <span className={styles['fil-content-ext']}>{extension}</span>}
        {opening === true && <div className={styles['fil-loading']} />}
      </div>
    )
  }
}

export default translate()(File)
