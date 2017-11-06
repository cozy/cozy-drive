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
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${percent}%`,
    maxWidth: '100%',
    height: `${2}px`,
    borderRadius: '0 1px 1px 0',
    transition: `${0.4}s width, ${0.4}s background-color`,
    backgroundColor: color || 'darkblue',
    ...style
  }
  return (
    <div style={containerStyle}>
      <div style={barStyle} />
    </div>
  )
}

const UploadProgression = ({ t, current, total, media }) => {
  return (
    <div className={styles['coz-upload-status']}>
      <Progress percent={percent(current, total)} />
      {media.filePath ? (
        <img className={styles['coz-progress-pic']} src={media.filePath} />
      ) : (
        <div
          className={styles['coz-progress-pic']}
          style={{ border: '1px solid darkgray', backgroundColor: 'lightGray' }}
        />
      )}
      <div className={styles['coz-upload-status__content']}>
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
    <div className={styles['coz-upload-status__content']}>
      {t('mobile.settings.media_backup.media_uptodate')}
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
    : { media: undefined, current: undefined, total: undefined }

const UploadStatus = props =>
  props.media && props.current && props.total ? (
    <UploadProgression {...props} />
  ) : (
    <UploadUptodate {...props} />
  )

export default connect(mapStateToProps)(translate()(UploadStatus))
