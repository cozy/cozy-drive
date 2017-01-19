import React, { Component } from 'react'
import classNames from 'classnames'
import filesize from 'filesize'

import styles from '../styles/table'
import { translate } from '../lib/I18n'
import FilenameInput from '../components/FilenameInput'

const splitFilename = filename => {
  let dotIdx = filename.lastIndexOf('.') - 1 >>> 0
  return {
    extension: filename.slice(dotIdx + 1),
    filename: filename.slice(0, dotIdx + 1)
  }
}

const isDir = attrs => attrs.type === 'directory'

const getClassFromMime = attrs => {
  if (isDir(attrs)) {
    return styles['fil-file-folder']
  }
  return styles['fil-file-' + attrs.mime.split('/')[0]] || styles['fil-file-files']
}

class File extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: props.attributes.isNew === true
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.attributes.isNew === true && !this.props.attributes.isNew) {
      this.setState({
        editing: true
      })
    }
  }

  edit (value) {
    this.props.onEdit(value, this.props.attributes)
    this.setState({
      editing: false
    })
  }

  render ({ t, f, attributes, onOpen }, { editing }) {
    return (
      <tr>
        {this.renderFilenameCell(attributes, onOpen, editing)}
        <td>
          <time datetime=''>{ f(attributes.created_at, 'MMM D, YYYY') }</time>
        </td>
        <td>
          {isDir(attributes)
            ? '-'
            : filesize(attributes.size, {base: 10})}
        </td>
        <td>—</td>
      </tr>
    )
  }

  renderFilenameCell (attributes, onOpen, editing) {
    const { filename, extension } = splitFilename(attributes.name)
    const classes = classNames(styles['fil-content-file'], getClassFromMime(attributes))
    if (editing) {
      return (
        <td class={classes}>
          <FilenameInput name={attributes.name} onSubmit={val => this.edit(val)} />
        </td>
      )
    }
    return isDir(attributes)
      ? (
        <td class={classes}>
          <a onClick={() => onOpen(attributes.id)}>
            {attributes.name}
            {attributes.isOpening === true && <div class={styles['fil-loading']} />}
          </a>
        </td>
      )
      : <td class={classes}><a target='_blank' href={`http://cozy.local:8080/files/download/${attributes.id}`}>{filename}<span class={styles['fil-content-ext']}>{extension}</span></a></td>
  }
}

export default translate()(File)
