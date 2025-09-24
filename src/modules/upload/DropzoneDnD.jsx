import cx from 'classnames'
import React from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
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
import { useUploadContext } from '@/modules/upload/UploadProvider'

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

export const Dropzone = ({ displayedFolder, children }) => {
  const client = useClient()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { showAlert } = useAlert()
  const sharingState = useSharingContext()
  const vaultClient = useVaultClient()
  const dispatch = useDispatch()
  const { addNewItems } = useUploadContext()
  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      canDrop: item => canDropHelper(item),
      drop(item) {
        const filesToUpload = canHandleFolders(item)
          ? item.dataTransfer.items
          : item.files
        dispatch(
          uploadFiles(
            filesToUpload,
            displayedFolder._id,
            sharingState,
            () => null,
            {
              client,
              vaultClient,
              showAlert,
              t
            },
            displayedFolder.driveId,
            addNewItems
          )
        )
      },
      collect: monitor => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop()
        }
      }
    }),
    [displayedFolder]
  )

  const isActive = canDrop && isOver

  return (
    <RightClickAddMenu>
      <Content
        ref={dropRef}
        className={cx(isMobile ? '' : 'u-pt-1', {
          [styles['fil-dropzone-active']]: isActive
        })}
      >
        {isActive && <DropzoneTeaser currentFolder={displayedFolder} />}
        {children}
      </Content>
    </RightClickAddMenu>
  )
}

const DropzoneWrapper = ({ displayedFolder, disabled, children }) => {
  const { isMobile } = useBreakpoints()

  if (disabled) {
    return <Content className={isMobile ? '' : 'u-pt-1'}>{children}</Content>
  }

  return <Dropzone displayedFolder={displayedFolder}>{children}</Dropzone>
}

export default DropzoneWrapper
