import cx from 'classnames'
import React, { Component } from 'react'
import UIDropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { withClient } from 'cozy-client'
import { withVaultClient } from 'cozy-keys-lib'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/dropzone.styl'

import { uploadFiles } from '@/modules/navigation/duck'
import DropzoneTeaser from '@/modules/upload/DropzoneTeaser'

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
    const { uploadFiles, client, vaultClient, showAlert, t } = this.props
    this.setState(state => ({ ...state, dropzoneActive: false }))
    if (!canDrop(evt)) return
    const filesToUpload = canHandleFolders(evt) ? evt.dataTransfer.items : files
    uploadFiles(filesToUpload, { client, vaultClient, showAlert, t })
  }

  render() {
    const { dropzoneActive } = this.state
    const { displayedFolder, isMobile, children, disabled, role } = this.props

    return (
      <UIDropzone
        disabled={disabled}
        role={role}
        className={cx(isMobile ? '' : 'u-pt-1', {
          [styles['fil-dropzone-active']]: dropzoneActive
        })}
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
  uploadFiles: (files, { client, vaultClient, showAlert, t }) =>
    dispatch(
      uploadFiles(files, displayedFolder.id, sharingState, () => null, {
        client,
        vaultClient,
        showAlert,
        t
      })
    )
})

const DropzoneWrapper = props => {
  const { showAlert } = useAlert()
  const { isMobile } = useBreakpoints()

  return <Dropzone {...props} isMobile={isMobile} showAlert={showAlert} />
}

export default compose(
  translate(),
  withSharingState,
  withClient,
  withVaultClient,
  connect(null, mapDispatchToProps)
)(DropzoneWrapper)
