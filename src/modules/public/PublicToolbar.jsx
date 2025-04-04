import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import PublicToolbarByLink from './PublicToolbarByLink'
import PublicToolbarCozyToCozy from './PublicToolbarCozyToCozy'

const PublicToolbar = ({
  hasWriteAccess,
  refreshFolderContent,
  files,
  sharingInfos,
  className
}) => {
  const { loading, addSharingLink } = sharingInfos

  if (loading) return null
  return (
    <div
      className={cx('u-flex u-flex-justify-end', className)}
      data-testid="public-toolbar"
    >
      {!addSharingLink ? (
        <PublicToolbarByLink
          files={files}
          hasWriteAccess={hasWriteAccess}
          refreshFolderContent={refreshFolderContent}
        />
      ) : (
        <PublicToolbarCozyToCozy files={files} sharingInfos={sharingInfos} />
      )}
    </div>
  )
}

PublicToolbar.propTypes = {
  files: PropTypes.array.isRequired,
  // hasWriteAccess is only required if we're in a sharing by link
  hasWriteAccess: PropTypes.bool,
  // refreshFolderContent is not required if we're displaying only one file or in a cozy to cozy sharing
  refreshFolderContent: PropTypes.func,
  sharingInfos: PropTypes.object,
  className: PropTypes.string
}

export default PublicToolbar
