import React from 'react'
import { SharedRecipients } from 'cozy-sharing'
import shareContainer from './share'

import { useDisplayedFolder } from 'drive/web/modules/selectors'

const SharedRecipientsComponent = ({ share }) => {
  const displayedFolder = useDisplayedFolder()

  return (
    <SharedRecipients
      docId={displayedFolder && displayedFolder.id}
      onClick={() => share(displayedFolder)}
    />
  )
}

export default shareContainer(SharedRecipientsComponent)
