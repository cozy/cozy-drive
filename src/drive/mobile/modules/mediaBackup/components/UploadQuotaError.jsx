import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from '../styles.styl'

const UploadQuotaError = ({ t, url }) => (
  <div
    className={classnames(
      styles['coz-upload-status'],
      styles['coz-upload-status--error']
    )}
  >
    <div className={styles['coz-upload-status-content']}>
      <div>{t('mobile.settings.media_backup.quota')}</div>
      <button
        className={styles['coz-upload-status-link']}
        onClick={() => window.open(url, '_system')}
      >
        {t('mobile.settings.media_backup.quota_contact')}
      </button>
    </div>
  </div>
)

UploadQuotaError.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default UploadQuotaError
