import React from 'react'
import classnames from 'classnames'

const ShareButton = ({ label, disabled, onShare, className }) => (
  <button
    role='button'
    disabled={disabled}
    className={classnames(className, 'coz-btn', 'coz-btn--secondary', 'coz-btn--share')}
    onClick={() => onShare()}
  >
    {label}
  </button>
)

export default ShareButton
