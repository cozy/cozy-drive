import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import styles from '../styles/table'
import { renameFile } from '../actions'
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

const FilenameCell = ({ renaming, index, attributes, onSubmit }) => {
  const { filename, extension } = splitFilename(attributes.name)
  const classes = classNames(styles['fil-content-file'], getClassFromMime(attributes))
  if (renaming === index) {
    return (
      <td class={classes}>
        <FilenameInput name={attributes.name} onSubmit={onSubmit} />
      </td>
    )
  }
  return isDir(attributes)
    ? <td class={classes}>{attributes.name}</td>
    : <td class={classes}>{filename}<span class={styles['fil-content-ext']}>{extension}</span></td>
}

const mapStateToProps = (state, ownProps) => ({
  renaming: state.ui.renaming
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (newName) => {
    dispatch(renameFile(ownProps.index, newName, ownProps.attributes))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilenameCell)
