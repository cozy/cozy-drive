import React from 'react'
import toolbarContainer from '../containers/toolbar'

const SharedRecipients = ({ displayedFolder }) => {
  return <SharedRecipients docId={displayedFolder && displayedFolder.id} />
}

export default toolbarContainer(SharedRecipients)
