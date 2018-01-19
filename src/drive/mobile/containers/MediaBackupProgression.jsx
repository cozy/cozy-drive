import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import UploadProgression from '../ducks/mediaBackup/UploadProgression'
import UploadAbortedWifi from '../ducks/mediaBackup/UploadAbortedWifi'
import UploadQuotaError from '../ducks/mediaBackup/UploadQuotaError'
import UploadUptodate from '../ducks/mediaBackup/UploadUptodate'

const mapStateToProps = state =>
  state.mobile.mediaBackup.currentUpload
    ? {
        current: state.mobile.mediaBackup.currentUpload.messageData.current,
        total: state.mobile.mediaBackup.currentUpload.messageData.total
      }
    : {
        current: undefined,
        total: undefined,
        aborted: state.mobile.mediaBackup.abortedMediaBackup,
        quotaError: state.mobile.mediaBackup.diskQuotaReached
      }

const UploadStatus = props => {
  const { t, current, total, aborted, quotaError } = props

  if (current !== undefined && total !== undefined)
    return <UploadProgression t={t} current={current} total={total} />
  else if (aborted) return <UploadAbortedWifi t={t} />
  else if (quotaError) return <UploadQuotaError t={t} />
  else return <UploadUptodate t={t} />
}

export default connect(mapStateToProps)(translate()(UploadStatus))
