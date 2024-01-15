import { useDisplayedFolder } from 'hooks'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SharedRecipients } from 'cozy-sharing'

import { getPathToShareDisplayedFolder } from 'modules/drive/Toolbar/share/helpers'

const SharedRecipientsComponent = () => {
  const { displayedFolder } = useDisplayedFolder()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const share = () => {
    navigate(getPathToShareDisplayedFolder(pathname))
  }

  return (
    <SharedRecipients
      docId={displayedFolder && displayedFolder.id}
      onClick={share}
    />
  )
}

export default SharedRecipientsComponent
