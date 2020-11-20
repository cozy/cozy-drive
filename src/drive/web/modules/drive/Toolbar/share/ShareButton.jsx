import React from 'react'
import { ShareButton } from 'cozy-sharing'
import cx from 'classnames'

import styles from './styles.styl'
import shareContainer from './share'
const ShareButtonWithProps = ({ displayedFolder, share, isDisabled }) => {
  return (
    <ShareButton
      docId={displayedFolder.id}
      disabled={isDisabled}
      onClick={() => share(displayedFolder)}
      className={cx('u-hide--mob', styles['share--button'])}
    />
  )
}

export default shareContainer(ShareButtonWithProps)
