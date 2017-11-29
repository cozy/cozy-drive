import React from 'react'
import classnames from 'classnames'
import styles from './styles'

const UploadAbortedWifi = ({ t }) => (
  <div
    className={classnames(
      styles['coz-upload-status'],
      styles['coz-upload-status--waiting']
    )}
  >
    <div className={styles['coz-upload-status-content']}>
      {t('mobile.settings.media_backup.no_wifi')}
    </div>
  </div>
)

export default UploadAbortedWifi
