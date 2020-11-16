import React from 'react'
import PropTypes from 'prop-types'

import PublicToolbarByLink from './PublicToolbarByLink'
import PublicToolbarCozyToCozy from './PublicToolbarCozyToCozy'
import { useSharingInfos } from './useSharingInfos'

const PublicToolbar = ({ hasWriteAccess, refreshFolderContent, files }) => {
  const {
    loading,
    discoveryLink,
    sharing,
    isSharingShortcutCreated
  } = useSharingInfos()
  return (
    <>
      {loading && null}
      {!loading &&
        !discoveryLink && (
          <PublicToolbarByLink
            files={files}
            hasWriteAccess={hasWriteAccess}
            refreshFolderContent={refreshFolderContent}
          />
        )}

      {!loading &&
        discoveryLink && (
          <PublicToolbarCozyToCozy
            discoveryLink={discoveryLink}
            files={files}
            isSharingShortcutCreated={isSharingShortcutCreated}
            sharing={sharing}
          />
        )}
    </>
  )
}

PublicToolbar.propTypes = {
  files: PropTypes.array.isRequired,
  // hasWriteAccess is only required if we're in a sharing by link
  hasWriteAccess: PropTypes.bool,
  // refreshFolderContent is not required if we're displaying only one file or in a cozy to cozy sharing
  refreshFolderContent: PropTypes.func
}

export default PublicToolbar
