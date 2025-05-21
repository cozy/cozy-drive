import cx from 'classnames'
import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone'
import { useDispatch } from 'react-redux'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { useSharingContext } from 'cozy-sharing'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/dropzone.styl'

import { uploadFiles } from '@/modules/navigation/duck'
import DropzoneTeaser from '@/modules/upload/DropzoneTeaser'

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
      <ReactDropzone
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
      </ReactDropzone>
    )
  }
}

const DropzoneWrapper = ({ role, displayedFolder, disabled, children }) => {
  const { showAlert } = useAlert()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const client = useClient()
  const sharingState = useSharingContext()
  const vaultClient = useVaultClient()
  const dispatch = useDispatch()

  return (
    <Dropzone
      role={role}
      disabled={disabled}
      displayedFolder={displayedFolder}
      isMobile={isMobile}
      showAlert={showAlert}
      t={t}
      client={client}
      sharingState={sharingState}
      vaultClient={vaultClient}
      uploadFiles={(files, { client, vaultClient, showAlert, t }) =>
        dispatch(
          uploadFiles(files, displayedFolder.id, sharingState, () => null, {
            client,
            vaultClient,
            showAlert,
            t
          })
        )
      }
    >
      {children}
    </Dropzone>
  )
}

export default DropzoneWrapper
