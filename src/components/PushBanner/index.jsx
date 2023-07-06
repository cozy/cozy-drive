/* global __TARGET__ */
import React from 'react'
import PropTypes from 'prop-types'

import BannerClient from '../../components/pushClient/Banner'
import { isFlagshipApp } from 'cozy-device-helper'

/**
 * Component to manage all banner display logic
 */
const PushBanner = ({ isPublic }) => {
  if (__TARGET__ !== 'mobile' && !isPublic && !isFlagshipApp()) {
    return <BannerClient />
  }
}

PushBanner.defaultProps = {
  isPublic: false
}

PushBanner.propTypes = {
  /** Whether public context */
  isPublic: PropTypes.bool
}

export default PushBanner
