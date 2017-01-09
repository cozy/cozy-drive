import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

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

  render ({ f, attributes }, { editing }) {
    return (
      <tr>
        {this.renderFilenameCell(attributes, editing)}
        <td>
          <time datetime=''>{ f(attributes.created_at, 'MMM D, YYYY') }</time>
        </td>
        <td>—</td>
        <td>—</td>
      </tr>
    )
  }

  renderFilenameCell (attributes, editing) {
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
      ? <td class={classes}><Link to={`files/${attributes.id}`}>{attributes.name}</Link></td>
      : <td class={classes}>{filename}<span class={styles['fil-content-ext']}>{extension}</span></td>
  }
}

export default translate()(File)
