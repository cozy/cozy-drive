import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import styles from '../styles/uploadprogression'
import { translate } from 'cozy-ui/react/I18n'

const percent = (actual, total) => Math.floor(actual * 100 / total)

const Progress = ({ percent, style, color, background }) => {
  const containerStyle = {
    opacity: percent < 100 ? 1 : 0,
    transition: `${0.4}s opacity}`,
    transitionDelay: `${percent < 100 ? 0 : 0.4}s`,
    height: `${2}px`,
    backgroundColor: background ? 'lightgray' : ''
  }
  const barStyle = {
    width: `${percent}%`,
    ...style
  }
  return (
    <div style={containerStyle}>
      <div className={styles['coz-progress']} style={barStyle} />
    </div>
  )
}

const UploadProgression = ({ t, current, total, media }) => {
  return (
    <div className={styles['coz-upload-status']}>
      <Progress percent={percent(current, total)} />
      <div className={styles['coz-progress-pic']}>
        {media.filePath && <img src={media.filePath} />}
      </div>
      <div className={styles['coz-upload-status-content']}>
        {t('mobile.settings.media_backup.media_upload', {
          remaining: total - current
        })}
      </div>
    </div>
  )
}

const UploadUptodate = ({ t }) => (
  <div
    className={classnames(
      styles['coz-upload-status'],
      styles['coz-upload-status--success']
    )}
  >
    <div className={styles['coz-upload-status-content']}>
      {t('mobile.settings.media_backup.media_uptodate')}
    </div>
  </div>
)

const UploadAbortedWifi = ({ t }) => (
  <div
    className={classnames(
      styles['coz-upload-status'],
      styles['coz-upload-status--waiting']
    )}
  >
    <div className={styles['coz-upload-status-content']}>
      {t('mobile.settings.media_backup.media_wifi')}
    </div>
  </div>
)

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
        aborted: state.mobile.mediaBackup.abortedMediaBackup
      }

const UploadStatus = props => {
  if (props.media && props.current && props.total)
    return <UploadProgression {...props} />
  else if (props.aborted) return <UploadAbortedWifi {...props} />
  else return <UploadUptodate {...props} />
}

export default connect(mapStateToProps)(translate()(UploadStatus))
