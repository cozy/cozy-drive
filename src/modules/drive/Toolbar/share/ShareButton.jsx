import cx from 'classnames'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ShareButton } from 'cozy-sharing'

import { useDisplayedFolder } from '@/hooks'
import { getPathToShareDisplayedFolder } from '@/modules/drive/Toolbar/share/helpers'

const ShareButtonWithProps = ({ isDisabled, className }) => {
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
      className={cx('u-hide--mob', className)}
      onClick={() => share(displayedFolder)}
    />
  )
}

export default ShareButtonWithProps
