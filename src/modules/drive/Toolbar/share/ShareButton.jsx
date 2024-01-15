import cx from 'classnames'
import { useDisplayedFolder } from 'hooks'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ShareButton } from 'cozy-sharing'

import styles from './styles.styl'
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
      onClick={() => share(displayedFolder)}
      className={cx('u-hide--mob', styles['share--button'])}
    />
  )
}

export default ShareButtonWithProps
