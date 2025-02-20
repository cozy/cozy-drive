import React, { Component } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import UIDropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { withClient } from 'cozy-client'
import { withVaultClient } from 'cozy-keys-lib'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/dropzone.styl'

import { uploadFiles } from '@/modules/navigation/duck'
import DropzoneTeaser from '@/modules/upload/DropzoneTeaser'

// const Dropzone = ({ displayedFolder, onDrop, disabled, role, children }) => {
//   const [{ canDrop, isOver }, drop] = useDrop(
//     () => ({
//       accept: [NativeTypes.FILE],
//       canDrop: item => canDropHelper(item),
//       drop(item) {
//         console.log(item)
//         const filesToUpload = canHandleFolders(item)
//           ? item.dataTransfer.items
//           : item.files
//         console.log('==========')
//         console.log('filesToUpload : ', filesToUpload)
//         console.log('==========')
//         // uploadFiles(filesToUpload, { client, vaultClient, showAlert, t })
//       },
//       collect: monitor => {
//         return {
//           isOver: monitor.isOver(),
//           canDrop: monitor.canDrop()
//         }
//       }
//     }),
//     [onDrop]
//   )
//   const isActive = canDrop && isOver

//   if (disabled) {
//     return <div role={role}>{children}</div>
//   }

//   return (
//     <div
//       role={role}
//       ref={drop}
//       className={isActive ? styles['fil-dropzone-active'] : ''}
//     >
//       {isActive && <DropzoneTeaser currentFolder={displayedFolder} />}
//       {children}
//     </div>
//   )
// }

export class Dropzone extends Component {
  state = {
    dropzoneActive: this.props.isActive
  }

  render() {
    const { displayedFolder, children, disabled, role, isActive, innerRef } =
      this.props

    if (disabled) {
      return <div role={role}>{children}</div>
    }

    return (
      <div
        role={role}
        ref={innerRef}
        className={isActive ? styles['fil-dropzone-active'] : ''}
      >
        {isActive && <DropzoneTeaser currentFolder={displayedFolder} />}
        {children}
      </div>
    )

    // return (
    //   <UIDropzone
    //     disabled={disabled}
    //     role={role}
    //     className={dropzoneActive ? styles['fil-dropzone-active'] : ''}
    //     disableClick
    //     style={{}}
    //     onDrop={this.onDrop}
    //     onDragEnter={this.onDragEnter}
    //     onDragLeave={this.onDragLeave}
    //   >
    //     {dropzoneActive && <DropzoneTeaser currentFolder={displayedFolder} />}
    //     {children}
    //   </UIDropzone>
    // )
  }
}

// DnD helpers for folder upload
const canHandleFolders = evt => {
  if (!evt.dataTransfer) return false
  const dt = evt.dataTransfer
  return dt.items && dt.items.length && dt.items[0].webkitGetAsEntry != null
}

const canDropHelper = evt => {
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

const DropzoneWrapper = ({
  vaultClient,
  client,
  t,
  uploadFiles: uploadFilesProp,
  ...props
}) => {
  const { showAlert } = useAlert()

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      canDrop: item => canDropHelper(item),
      drop(item) {
        console.log(item)
        const filesToUpload = canHandleFolders(item)
          ? item.dataTransfer.items
          : item.files
        console.log('==========')
        console.log('filesToUpload : ', filesToUpload)
        console.log('vaultClient, client, t : ', vaultClient, client, t)
        console.log('==========')
        uploadFilesProp(filesToUpload, { client, vaultClient, showAlert, t })
      },
      collect: monitor => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop()
        }
      }
    }),
    []
  )
  const isActive = canDrop && isOver

  return (
    <Dropzone
      {...props}
      isActive={isActive}
      innerRef={drop}
      showAlert={showAlert}
    />
  )
}

export default compose(
  translate(),
  withSharingState,
  withClient,
  withVaultClient,
  connect(null, mapDispatchToProps)
)(DropzoneWrapper)
