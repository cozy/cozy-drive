import cx from 'classnames'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { useSharingContext } from 'cozy-sharing'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/dropzone.styl'

import RightClickAddMenu from '@/components/RightClick/RightClickAddMenu'
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

export const Dropzone = ({
  displayedFolder,
  disabled,
  refreshFolderContent = null,
  children
}) => {
  const client = useClient()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { showAlert } = useAlert()
  const sharingState = useSharingContext()
  const vaultClient = useVaultClient()
  const dispatch = useDispatch()

  const fileUploadCallback = refreshFolderContent
    ? refreshFolderContent
    : () => null

  const onDrop = async (files, _, evt) => {
    if (!canDrop(evt)) return

    const filesToUpload = canHandleFolders(evt) ? evt.dataTransfer.items : files
    dispatch(
      uploadFiles(
        filesToUpload,
        displayedFolder.id,
        sharingState,
        fileUploadCallback,
        {
          client,
          vaultClient,
          showAlert,
          t
        }
      )
    )
  }

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    noClick: true,
    noKeyboard: true
  })

  return (
    <RightClickAddMenu>
      <Content
        className={cx(isMobile ? '' : 'u-pt-1', {
          [styles['fil-dropzone-active']]: isDragActive
        })}
        {...getRootProps()}
      >
        {isDragActive && <DropzoneTeaser currentFolder={displayedFolder} />}
        {children}
      </Content>
    </RightClickAddMenu>
  )
}

export default Dropzone
