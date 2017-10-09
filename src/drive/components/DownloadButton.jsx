import React from 'react'
import classnames from 'classnames'

const DownloadButton = ({ label, disabled = false, onDownload, className }) => (
  <button
    role="button"
    disabled={disabled}
    className={classnames(
      className,
      'coz-btn',
      'coz-btn--regular',
      'coz-btn--download'
    )}
    onClick={() => onDownload()}
  >
    {label}
  </button>
)

export default DownloadButton
