import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from '../styles.styl'

const UploadProgression = ({ t, current, total, progress }) => {
  return (
    <div className={styles['coz-upload-status-wrapper']}>
      <progress
        max={total}
        value={current}
        className={classNames(
          styles['coz-upload-progress'],
          styles['coz-upload-progress--global']
        )}
      />
      <div className={styles['coz-upload-status']}>
        <div className={styles['coz-progress-pic']} />
        <div className={styles['coz-upload-status-content']}>
          {t('mobile.settings.media_backup.media_upload', {
            smart_count: total - current
          })}
          {progress !== undefined ? (
            <progress
              max={100}
              value={progress}
              className={classNames(
                styles['coz-upload-progress'],
                styles['coz-upload-progress--individual']
              )}
            />
          ) : (
            <div className={styles['infinite-progress']} />
          )}
        </div>
      </div>
    </div>
  )
}

UploadProgression.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progress: PropTypes.number,
  t: PropTypes.func.isRequired
}

export default UploadProgression
