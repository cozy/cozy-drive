import React from 'react'

import { ShareContentVz } from './ShareContentVz'
import { SharingShortcutBadgeVz } from './SharingShortcutBadgeVz'

const Share = ({ row, isRowDisabledOrInSyncFromSharing }) => {
  return (
    <>
      <ShareContentVz file={row} disabled={isRowDisabledOrInSyncFromSharing} />
      <SharingShortcutBadgeVz file={row} />
    </>
  )
}

export default Share
