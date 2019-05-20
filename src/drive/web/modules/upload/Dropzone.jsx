import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { compose } from 'redux'

import { uploadFiles } from 'drive/web/modules/navigation/duck'

import styles from 'drive/styles/dropzone.styl'
import withSharingState from 'sharing/hoc/withSharingState'
import DropzoneTeaser from 'drive/web/modules/upload/DropzoneTeaser'

class StatefulDropzone extends Component {
  state = {
    dropzoneActive: false
  }

  onDragEnter = evt => {
    if (!canDrop(evt)) return
    this.setState(state => ({ ...state, dropzoneActive: true }))
  }

  onDragLeave = () =>
    this.setState(state => ({ ...state, dropzoneActive: false }))

  onDrop = async (files, _, evt) => {
    const { displayedFolder, sharingState, uploadFiles } = this.props
    const folderId = displayedFolder.id
    this.setState(state => ({ ...state, dropzoneActive: false }))
    if (!canDrop(evt)) return
    const filesToUpload = canHandleFolders(evt) ? evt.dataTransfer.items : files
    uploadFiles(filesToUpload, folderId, sharingState)
  }

  render() {
    const { dropzoneActive } = this.state
    const {
      displayedFolder,
      children,
      /* don't pass these props to Dropzone */
      sharingState, // eslint-disable-line no-unused-vars
      uploadFiles, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props
    return (
      <Dropzone
        {...rest}
        className={dropzoneActive ? styles['fil-dropzone-active'] : ''}
        disableClick
        style={{}}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {dropzoneActive && <DropzoneTeaser currentFolder={displayedFolder} />}
        {children}
      </Dropzone>
    )
  }
}

// DnD helpers for folder upload
const canHandleFolders = evt => {
  if (!evt.dataTransfer) return false
  const dt = evt.dataTransfer
  return dt.items && dt.items.length && dt.items[0].webkitGetAsEntry != null
}

const canDrop = evt => {
  const items = evt.dataTransfer.items
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].kind !== 'file') return false
  }
  return true
}

const mapDispatchToProps = {
  uploadFiles
}

export default compose(
  withSharingState,
  connect(
    null,
    mapDispatchToProps
  )
)(StatefulDropzone)
