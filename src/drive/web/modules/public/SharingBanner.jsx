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

  return (
    !loading &&
    isOpened &&
    (!discoveryLink ? (
      <SharingBannerByLink onClose={onClose} />
    ) : (
      <SharingBannerCozyToCozy
        isSharingShortcutCreated={isSharingShortcutCreated}
        sharing={sharing}
        discoveryLink={discoveryLink}
        onClose={onClose}
      />
    ))
  )
}

SharingBanner.propTypes = {
  sharingInfos: PropTypes.object
}

export default SharingBanner
