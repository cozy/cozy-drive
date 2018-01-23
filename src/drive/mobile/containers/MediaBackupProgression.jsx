import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import PropTypes from 'prop-types'

import UploadProgression from '../ducks/mediaBackup/UploadProgression'
import UploadAbortedWifi from '../ducks/mediaBackup/UploadAbortedWifi'
import UploadQuotaError from '../ducks/mediaBackup/UploadQuotaError'
import UploadUptodate from '../ducks/mediaBackup/UploadUptodate'

const mapStateToProps = state =>
  state.mobile.mediaBackup.currentUpload &&
  !state.mobile.mediaBackup.diskQuotaReached
    ? {
        current: state.mobile.mediaBackup.currentUpload.messageData.current,
        total: state.mobile.mediaBackup.currentUpload.messageData.total
      }
    : {
        current: undefined,
        total: undefined,
        aborted: state.mobile.mediaBackup.abortedMediaBackup,
        quotaError: state.mobile.mediaBackup.diskQuotaReached,
        serverUrl: state.mobile.settings.serverUrl
      }

const UploadStatus = props => {
  const { t, current, total, aborted, quotaError, serverUrl } = props
  const storageUpgradeUrl = serverUrl
    ? serverUrl.replace(/(\w+)\./, '$1-settings.') + '/#/storage'
    : ''

  if (current !== undefined && total !== undefined)
    return <UploadProgression t={t} current={current} total={total} />
  else if (aborted) return <UploadAbortedWifi t={t} />
  else if (quotaError) return <UploadQuotaError t={t} url={storageUpgradeUrl} />
  else return <UploadUptodate t={t} />
}

UploadStatus.propTypes = {
  t: PropTypes.func.isRequired,
  current: PropTypes.number,
  total: PropTypes.number,
  aborted: PropTypes.bool,
  quotaError: PropTypes.bool,
  serverUrl: PropTypes.string
}

export default connect(mapStateToProps)(translate()(UploadStatus))
