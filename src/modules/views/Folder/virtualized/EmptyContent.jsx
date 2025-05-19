import React from 'react'

import { EmptyDrive, EmptyTrash } from '@/components/Error/Empty'
import { TRASH_DIR_ID } from '@/constants/config'
import { isEncryptedFolder } from '@/lib/encryption'

const EmptyContent = ({
  displayedFolder,
  isEmpty,
  currentFolderId,
  canUpload
}) => {
  const isEncFolder = isEncryptedFolder(displayedFolder)

  if (displayedFolder !== null && isEmpty && currentFolderId !== TRASH_DIR_ID) {
    return <EmptyDrive isEncrypted={isEncFolder} canUpload={canUpload} />
  }

  if (displayedFolder !== null && isEmpty && currentFolderId === TRASH_DIR_ID) {
    return <EmptyTrash canUpload={canUpload} />
  }

  return null
}

export default EmptyContent
