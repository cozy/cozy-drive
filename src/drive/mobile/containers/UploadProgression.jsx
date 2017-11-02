import React from 'react'
import { connect } from 'react-redux'
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

const UploadProgression = ({ t, messageData, media }) => {
  return (
    <div className={styles['coz-progress']}>
      <Progress
        percent={percent(messageData.upload_counter, messageData.total_upload)}
      />
      {media.filePath ? (
        <img className={styles['coz-progress__pic']} src={media.filePath} />
      ) : (
        <div
          className={styles['coz-progress__pic']}
          style={{ border: '1px solid darkgray', backgroundColor: 'lightGray' }}
        />
      )}
      <div className={styles['coz-progress__content']}>
        {t('mobile.settings.media_backup.media_upload', {
          remaining: messageData.total_upload - messageData.upload_counter
        })}
      </div>
    </div>
  )
}

const mapStateToProps = state => state.mobile.mediaBackup.currentUpload

const onlyIfProps = (isPropsOk, BaseComponent) => props =>
  isPropsOk(props) ? <BaseComponent {...props} /> : null

export default connect(mapStateToProps)(
  onlyIfProps(props => props.media, translate()(UploadProgression))
)
