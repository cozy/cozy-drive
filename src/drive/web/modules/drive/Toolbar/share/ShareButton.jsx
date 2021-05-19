import React from 'react'
import cx from 'classnames'

import { ShareButton } from 'cozy-sharing'

import shareContainer from './share'
import styles from './styles.styl'

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
