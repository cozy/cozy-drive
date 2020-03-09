import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import PropTypes from 'prop-types'

import {
  getServerUrl,
  isImagesBackupOn
} from 'drive/mobile/modules/settings/duck'

import UploadProgression from './components/UploadProgression'
import UploadAbortedWifi from './components/UploadAbortedWifi'
import UploadQuotaError from './components/UploadQuotaError'
import UploadUptodate from './components/UploadUptodate'
import UploadPreparing from './components/UploadPreparing'

import {
  isPreparingBackup,
  isUploading,
  isAborted,
  isQuotaReached,
  getUploadStatus
} from './duck/reducer'

const mapStateToProps = state => ({
  serverUrl: getServerUrl(state),
  isEnabled: isImagesBackupOn(state),
  isPreparing: isPreparingBackup(state),
  isUploading: isUploading(state),
  isAborted: isAborted(state),
  isQuotaReached: isQuotaReached(state),
  ...getUploadStatus(state)
})

export const UploadStatus = props => {
  const {
    isEnabled,
    isPreparing,
    isUploading,
    isAborted,
    isQuotaReached
  } = props
  const { t, current, total, progress, serverUrl } = props
  const storageUpgradeUrl = serverUrl
    ? serverUrl.replace(/(\w+)\./, '$1-settings.') + '/#/storage'
    : ''

  if (!isEnabled) {
    return null
  }
  if (isPreparing) {
    return <UploadPreparing t={t} />
  }
  if (isUploading) {
    return (
      <UploadProgression
        t={t}
        current={current}
        total={total}
        progress={progress}
      />
    )
  }
  if (isAborted) {
    return <UploadAbortedWifi t={t} />
  }
  if (isQuotaReached) {
    return <UploadQuotaError t={t} url={storageUpgradeUrl} />
  }
  return <UploadUptodate t={t} />
}

UploadStatus.propTypes = {
  t: PropTypes.func.isRequired,
  current: PropTypes.number,
  total: PropTypes.number,
  progress: PropTypes.number,
  isEnabled: PropTypes.bool,
  isPreparing: PropTypes.bool,
  isUploading: PropTypes.bool,
  isAborted: PropTypes.bool,
  isQuotaReached: PropTypes.bool,
  serverUrl: PropTypes.string
}

export default connect(mapStateToProps)(translate()(UploadStatus))
