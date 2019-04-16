import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from '../styles.styl'

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

UploadAbortedWifi.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadAbortedWifi
