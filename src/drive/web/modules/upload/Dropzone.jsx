import React, { Component } from 'react'
import { connect } from 'react-redux'
import UIDropzone from 'react-dropzone'
import { compose } from 'redux'
import { withVaultClient } from 'cozy-keys-lib'
import { withClient } from 'cozy-client'

import { uploadFiles } from 'drive/web/modules/navigation/duck'

import styles from 'drive/styles/dropzone.styl'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import DropzoneTeaser from 'drive/web/modules/upload/DropzoneTeaser'

export class Dropzone extends Component {
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
    const { uploadFiles, client, vaultClient } = this.props
    this.setState(state => ({ ...state, dropzoneActive: false }))
    if (!canDrop(evt)) return
    const filesToUpload = canHandleFolders(evt) ? evt.dataTransfer.items : files
    uploadFiles(filesToUpload, { client, vaultClient })
  }

  render() {
    const { dropzoneActive } = this.state
    const { displayedFolder, children, disabled, role } = this.props
    return (
      <UIDropzone
        disabled={disabled}
        role={role}
        className={dropzoneActive ? styles['fil-dropzone-active'] : ''}
        disableClick
        style={{}}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {dropzoneActive && <DropzoneTeaser currentFolder={displayedFolder} />}
        {children}
      </UIDropzone>
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

const mapDispatchToProps = (dispatch, { displayedFolder, sharingState }) => ({
  uploadFiles: (files, { client, vaultClient }) =>
    dispatch(
      uploadFiles(files, displayedFolder.id, sharingState, () => null, {
        client,
        vaultClient
      })
    )
})

export default compose(
  withSharingState,
  withClient,
  withVaultClient,
  connect(
    null,
    mapDispatchToProps
  )
)(Dropzone)
