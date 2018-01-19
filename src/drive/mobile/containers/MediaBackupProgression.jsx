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
        media: state.mobile.mediaBackup.currentUpload.media,
        current: state.mobile.mediaBackup.currentUpload.messageData.current,
        total: state.mobile.mediaBackup.currentUpload.messageData.total
      }
    : {
        media: undefined,
        current: undefined,
        total: undefined,
        aborted: state.mobile.mediaBackup.abortedMediaBackup,
        quotaError: state.mobile.mediaBackup.diskQuotaReached
      }

const UploadStatus = props => {
  const { t, current, total, media, aborted, quotaError } = props

  if (media !== undefined && current !== undefined && total !== undefined)
    return (
      <UploadProgression t={t} current={current} total={total} media={media} />
    )
  else if (aborted) return <UploadAbortedWifi t={t} />
  else if (quotaError) return <UploadQuotaError t={t} />
  else return <UploadUptodate t={t} />
}

export default connect(mapStateToProps)(translate()(UploadStatus))
