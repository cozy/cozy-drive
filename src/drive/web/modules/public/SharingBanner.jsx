import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import {
  SharingBannerByLink,
  SharingBannerCozyToCozy
} from 'components/sharing/PublicBanner'

const SharingBanner = ({ sharingInfos }) => {
  const [isOpened, setIsOpened] = useState(true)
  const onClose = useCallback(() => setIsOpened(false), [setIsOpened])

  const {
    loading,
    discoveryLink,
    sharing,
    isSharingShortcutCreated
  } = sharingInfos

  if (loading) return null
  return (
    isOpened && (
      <div data-testid="sharingBanner">
        {!discoveryLink ? (
          <SharingBannerByLink onClose={onClose} />
        ) : (
          <SharingBannerCozyToCozy
            isSharingShortcutCreated={isSharingShortcutCreated}
            sharing={sharing}
            discoveryLink={discoveryLink}
            onClose={onClose}
          />
        )}
      </div>
    )
  )
}

SharingBanner.propTypes = {
  sharingInfos: PropTypes.object
}

export default SharingBanner
