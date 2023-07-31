import React from 'react'
import { SharedRecipients } from 'cozy-sharing'
import { useLocation, useNavigate } from 'react-router-dom'

import { useDisplayedFolder } from 'drive/hooks'

const SharedRecipientsComponent = () => {
  const displayedFolder = useDisplayedFolder()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const share = () => {
    navigate(`${pathname}/share`)
  }

  return (
    <SharedRecipients
      docId={displayedFolder && displayedFolder.id}
      onClick={share}
    />
  )
}

export default SharedRecipientsComponent
