import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from '../styles.styl'

const UploadUptodate = ({ t }) => (
  <div
    className={classnames(
      styles['coz-upload-status'],
      styles['coz-upload-status--success']
    )}
  >
    <div className={styles['coz-upload-status-content']}>
      {t('mobile.settings.media_backup.media_uptodate')}
    </div>
  </div>
)

UploadUptodate.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadUptodate
