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
const isEditing = attrs => attrs.isNew === true && (attrs.isCreating === false || attrs.creationError !== null)

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
      editing: isEditing(props.attributes)
    }
  }

  componentWillReceiveProps (newProps) {
    if (isEditing(newProps.attributes) !== this.state.editing) {
      this.setState({
        editing: isEditing(newProps.attributes)
      })
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
    const { attributes, onToggle } = this.props
    onToggle(attributes.id, attributes.selected)
  }

  openFolder (e, id) {
    e.stopPropagation()
    this.props.onOpen(id)
  }

  render ({ t, f, attributes, onOpen, onShowActionMenu }, { editing }) {
    const onDoubleClickListener = isDir(attributes)
    ? () => onOpen(attributes.id)
    // TODO Handle files opening throught the app instead of doing it throught the browser
    : () => window.open(
      `${STACK_URL}/files/download/${attributes.id}`,
      '_blank')
    return (
      <div className={styles['fil-content-row']} onClick={e => this.toggle(e)} onDoubleClick={onDoubleClickListener}>
        <div className={classNames(styles['fil-content-cell'], styles['fil-content-file-select'])}>
          <span data-input='checkbox'>
            <input
              type='checkbox'
              checked={attributes.selected}
             />
            <label />
          </span>
        </div>
        {this.renderFilenameCell(attributes, onOpen, editing)}
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
          <button onClick={() => onShowActionMenu(attributes.id)} />
        </div>
      </div>
    )
  }

  renderFilenameCell (attributes, onOpen, editing) {
    const { filename, extension } = splitFilename(attributes.name)
    const classes = classNames(styles['fil-content-cell'], styles['fil-content-file'], getClassFromMime(attributes))
    if (editing) {
      return (
        <td className={classes}>
          <FilenameInput name={attributes.name} error={attributes.creationError} onSubmit={val => this.edit(val)} onAbort={() => this.abortEdit()} />
        </td>
      )
    }
    if (isDir(attributes)) {
      return (
        <div className={classes}>
          <a onClick={e => this.openFolder(e, attributes.id)}>
            {attributes.name}
            {(attributes.isOpening === true || attributes.isCreating === true) && <div className={styles['fil-loading']} />}
          </a>
        </div>
      )
    }
    return (
      <div className={classes}>
        <a
          target='_blank'
          href={`${STACK_URL}/files/download/${attributes.id}`}
        >
          {filename}
          <span className={styles['fil-content-ext']}>{extension}</span>
        </a>
      </div>
    )
  }
}

export default translate()(File)
