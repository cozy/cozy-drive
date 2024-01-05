import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ShareModal } from 'cozy-sharing'

import { useDisplayedFolder } from 'hooks'

const ShareDisplayedFolderView = () => {
  const { displayedFolder } = useDisplayedFolder()
  const navigate = useNavigate()

  if (displayedFolder) {
    const onClose = () => {
      navigate('..', { replace: true })
    }

    return (
      <ShareModal
        document={displayedFolder}
        documentType="Files"
        sharingDesc={displayedFolder.name}
        onClose={onClose}
      />
    )
  }

  return null
}

export { ShareDisplayedFolderView }
