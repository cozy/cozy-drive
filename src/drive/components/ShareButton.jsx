import React from 'react'
import classnames from 'classnames'
import styles from 'cozy-ui/stylus/components/button'

const ShareButton = ({ label, disabled, onShare, className }) => (
  <button
    role="button"
    disabled={disabled}
    className={classnames(
      className,
      styles['c-btn'],
      styles['c-btn--secondary'],
      styles['c-btn--share']
    )}
    onClick={() => onShare()}
  >
    {label}
  </button>
)

export default ShareButton
