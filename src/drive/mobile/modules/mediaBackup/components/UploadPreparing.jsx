import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from '../styles.styl'

const UploadPreparing = ({ t }) => (
  <div className={styles['coz-upload-status-wrapper']}>
    <div
      className={classnames(
        styles['infinite-progress'],
        styles['infinite-progress--global']
      )}
    />
    <div
      className={classnames(
        styles['coz-upload-status'],
        styles['coz-upload-status--waiting']
      )}
    >
      <div className={styles['coz-upload-status-content']}>
        {t('mobile.settings.media_backup.preparing')}
      </div>
    </div>
  </div>
)

UploadPreparing.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadPreparing
