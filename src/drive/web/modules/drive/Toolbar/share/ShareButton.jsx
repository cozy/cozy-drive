import React from 'react'
import cx from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'

import { ShareButton } from 'cozy-sharing'

import { useDisplayedFolder } from 'drive/hooks'
import { getPathToShareDisplayedFolder } from 'drive/web/modules/drive/Toolbar/share/helpers'
import styles from './styles.styl'

const ShareButtonWithProps = ({ isDisabled }) => {
  const displayedFolder = useDisplayedFolder()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const share = () => {
    navigate(getPathToShareDisplayedFolder(pathname))
  }

  return (
    <ShareButton
      docId={displayedFolder.id}
      disabled={isDisabled}
      onClick={() => share(displayedFolder)}
      className={cx('u-hide--mob', styles['share--button'])}
    />
  )
}

export default ShareButtonWithProps
