import React from 'react'

import ShareContent from './ShareContent'
import SharingShortcutBadge from './SharingShortcutBadge'

const Share = ({ row, isRowDisabledOrInSyncFromSharing }) => {
  return (
    <>
      <ShareContent file={row} disabled={isRowDisabledOrInSyncFromSharing} />
      <SharingShortcutBadge file={row} />
    </>
  )
}

export default Share
