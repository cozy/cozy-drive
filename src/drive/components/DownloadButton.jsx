import React from 'react'
import classnames from 'classnames'
import styles from 'cozy-ui/stylus/components/button'

const DownloadButton = ({ label, disabled = false, onDownload, className }) => (
  <button
    role="button"
    disabled={disabled}
    className={classnames(
      className,
      styles['c-btn'],
      styles['c-btn--regular'],
      styles['c-btn--download']
    )}
    onClick={() => onDownload()}
  >
    {label}
  </button>
)

export default DownloadButton
