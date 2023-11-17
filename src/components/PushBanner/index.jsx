/* global __TARGET__ */
import React from 'react'
import PropTypes from 'prop-types'

import { useInstanceInfo } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import { makeDiskInfos } from 'cozy-client/dist/models/instance'

import BannerClient from '../../components/pushClient/Banner'
import QuotaBanner from './QuotaBanner'
import { usePushBannerContext } from './PushBannerProvider'

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

  if (__TARGET__ !== 'mobile' && !isFlagshipApp()) {
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
