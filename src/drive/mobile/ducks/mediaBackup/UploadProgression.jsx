import React from 'react'
import PropTypes from 'prop-types'
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

UploadProgression.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
}

export default UploadProgression
