import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ShareModal } from 'cozy-sharing'

import { SHARING_TAB_DRIVES } from '@/constants/config'
import { useDisplayedFolder } from '@/hooks'

const ShareDisplayedFolderView = () => {
  const { displayedFolder } = useDisplayedFolder()
  const navigate = useNavigate()

  if (displayedFolder) {
    const onClose = () => {
      navigate('..', { replace: true })
    }

    const onRevokeSuccess = () => {
      if (displayedFolder.driveId) {
        navigate(`/sharings?tab=${SHARING_TAB_DRIVES}`)
      }
    }

    return (
      <ShareModal
        document={displayedFolder}
        documentType="Files"
        sharingDesc={displayedFolder.name}
        onClose={onClose}
        onRevokeSuccess={onRevokeSuccess}
      />
    )
  }

  return null
}

export { ShareDisplayedFolderView }
