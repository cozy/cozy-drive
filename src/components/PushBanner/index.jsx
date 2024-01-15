import PropTypes from 'prop-types'
import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import { makeDiskInfos } from 'cozy-client/dist/models/instance'
import { isFlagshipApp } from 'cozy-device-helper'

import { usePushBannerContext } from './PushBannerProvider'
import QuotaBanner from './QuotaBanner'
import BannerClient from '../../components/pushClient/Banner'

/**
 * Component to manage all banner display logic
 */
const PushBanner = ({ isPublic }) => {
  const { bannerDismissed } = usePushBannerContext()
  const { isLoaded, diskUsage } = useInstanceInfo()

  if (isPublic || !isLoaded) return null

  const diskInfos = makeDiskInfos(
    diskUsage?.data?.attributes?.used,
    diskUsage?.data?.attributes?.quota
  )

  if (!bannerDismissed.quota && diskInfos.percentUsage >= 80) {
    return <QuotaBanner />
  }

  if (!isFlagshipApp()) {
    return <BannerClient />
  }

  return null
}

PushBanner.defaultProps = {
  isPublic: false
}

PushBanner.propTypes = {
  /** Whether public context */
  isPublic: PropTypes.bool
}

export default PushBanner
