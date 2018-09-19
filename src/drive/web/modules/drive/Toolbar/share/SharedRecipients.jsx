import React from 'react'
import toolbarContainer from '../toolbar'
import { SharedRecipients } from 'sharing'

const SharedRecipientsComponent = ({ displayedFolder }) => {
  return <SharedRecipients docId={displayedFolder && displayedFolder.id} />
}

export default toolbarContainer(SharedRecipientsComponent)
