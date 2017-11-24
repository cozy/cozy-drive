import React from 'react'
import classNames from 'classnames'

import styles from './button'

export const ShareButton = ({ label, onClick, className, ...props }) => (
  <button
    role="button"
    className={classNames(
      styles['c-btn'],
      styles['c-btn--secondary'],
      styles['c-btn--share'],
      className
    )}
    onClick={() => onClick()}
    {...props}
  >
    {label}
  </button>
)

export const SharedByMeButton = ({ label, onClick, className, ...props }) => (
  <button
    role="button"
    className={classNames(styles['c-btn'], styles['coz-btn-shared'], className)}
    onClick={() => onClick()}
    {...props}
  >
    {label}
  </button>
)

export const SharedWithMeButton = ({ label, onClick, className, ...props }) => (
  <button
    role="button"
    className={classNames(
      styles['c-btn'],
      styles['coz-btn-sharedWithMe'],
      className
    )}
    onClick={() => onClick()}
    {...props}
  >
    {label}
  </button>
)

export default ShareButton
