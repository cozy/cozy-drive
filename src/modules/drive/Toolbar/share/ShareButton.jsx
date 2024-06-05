import { useDisplayedFolder } from 'hooks'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ShareButton } from 'cozy-sharing'

import { getPathToShareDisplayedFolder } from 'modules/drive/Toolbar/share/helpers'

const ShareButtonWithProps = ({ isDisabled }) => {
  const { displayedFolder } = useDisplayedFolder()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const share = () => {
    navigate(getPathToShareDisplayedFolder(pathname))
  }

  return (
    <ShareButton
      docId={displayedFolder.id}
      disabled={isDisabled}
      className="u-hide--mob"
      onClick={() => share(displayedFolder)}
    />
  )
}

export default ShareButtonWithProps
