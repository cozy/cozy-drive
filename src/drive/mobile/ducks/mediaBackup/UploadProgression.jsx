import React from 'react'
import styles from './styles'

const UploadProgression = ({ t, current, total }) => {
  return (
    <div>
      <progress max={total} value={current} />
      <div className={styles['coz-upload-status']}>
        <div className={styles['coz-progress-pic']} />
        <div className={styles['coz-upload-status-content']}>
          {t('mobile.settings.media_backup.media_upload', {
            smart_count: total - current
          })}
          <div className={styles['infinite-progress']} />
        </div>
      </div>
    </div>
  )
}

export default UploadProgression
