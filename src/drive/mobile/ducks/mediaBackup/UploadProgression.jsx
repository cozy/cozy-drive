import React from 'react'
import styles from './styles'

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
      <div className={styles['coz-progress-pic']} />
      <div className={styles['coz-upload-status-content']}>
        {t('mobile.settings.media_backup.media_upload', {
          smart_count: total - current
        })}
      </div>
    </div>
  )
}

export default UploadProgression
