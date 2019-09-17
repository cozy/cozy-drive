import React from 'react'
import { ShareButton } from 'sharing'

import shareContainer from './share'
const ShareButtonWithProps = ({ displayedFolder, share, isDisabled }) => {
  return (
    <ShareButton
      docId={displayedFolder.id}
      disabled={isDisabled}
      onClick={() => share(displayedFolder)}
      className={'u-hide--mob'}
    />
  )
}

export default shareContainer(ShareButtonWithProps)
