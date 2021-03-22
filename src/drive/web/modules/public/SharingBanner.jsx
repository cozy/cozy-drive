import React, { useState, useCallback } from 'react'

import {
  SharingBannerByLink,
  SharingBannerCozyToCozy
} from 'components/sharing/PublicBanner'
import { useSharingInfos } from 'drive/web/modules/public/useSharingInfos'

const SharingBanner = () => {
  const [isOpened, setIsOpened] = useState(true)
  const onClose = useCallback(() => setIsOpened(false), [setIsOpened])

  const {
    loading,
    discoveryLink,
    sharing,
    isSharingShortcutCreated
  } = useSharingInfos()

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

export default SharingBanner
