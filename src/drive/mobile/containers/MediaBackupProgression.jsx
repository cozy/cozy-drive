import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import PropTypes from 'prop-types'

import UploadProgression from '../ducks/mediaBackup/UploadProgression'
import UploadAbortedWifi from '../ducks/mediaBackup/UploadAbortedWifi'
import UploadQuotaError from '../ducks/mediaBackup/UploadQuotaError'
import UploadUptodate from '../ducks/mediaBackup/UploadUptodate'
import UploadPreparing from '../ducks/mediaBackup/UploadPreparing'

import {
  isPreparingBackup,
  isUploading,
  isAborted,
  isQuotaReached,
  getUploadStatus
} from '../ducks/mediaBackup/reducer'

import { getServerUrl } from '../ducks/settings/duck'

const mapStateToProps = state => ({
  serverUrl: getServerUrl(state),
  isPreparing: isPreparingBackup(state),
  isUploading: isUploading(state),
  isAborted: isAborted(state),
  isQuotaReached: isQuotaReached(state),
  ...getUploadStatus(state)
})

const UploadStatus = props => {
  const { isPreparing, isUploading, isAborted, isQuotaReached } = props
  const { t, current, total, progress, serverUrl } = props
  const storageUpgradeUrl = serverUrl
    ? serverUrl.replace(/(\w+)\./, '$1-settings.') + '/#/storage'
    : ''

  if (isPreparing) {
    return <UploadPreparing t={t} />
  } else if (isUploading) {
    return (
      <UploadProgression
        t={t}
        current={current}
        total={total}
        progress={progress}
      />
    )
  } else if (isAborted) {
    return <UploadAbortedWifi t={t} />
  } else if (isQuotaReached) {
    return <UploadQuotaError t={t} url={storageUpgradeUrl} />
  } else {
    return <UploadUptodate t={t} />
  }
}

UploadStatus.propTypes = {
  t: PropTypes.func.isRequired,
  current: PropTypes.number,
  total: PropTypes.number,
  progress: PropTypes.number,
  isPreparing: PropTypes.bool,
  isUploading: PropTypes.bool,
  isAborted: PropTypes.bool,
  isQuotaReached: PropTypes.bool,
  serverUrl: PropTypes.string
}

export default connect(mapStateToProps)(translate()(UploadStatus))
