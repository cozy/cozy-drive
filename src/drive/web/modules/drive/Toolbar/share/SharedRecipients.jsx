import React from 'react'
import toolbarContainer from '../toolbar'
import { SharedRecipients } from 'sharing'
import shareContainer from './share'

const SharedRecipientsComponent = ({ displayedFolder, share }) => {
  return (
    <SharedRecipients
      docId={displayedFolder && displayedFolder.id}
      onClick={() => share(displayedFolder)}
    />
  )
}

export default toolbarContainer(shareContainer(SharedRecipientsComponent))
