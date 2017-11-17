import React from 'react'
import classNames from 'classnames'

import styles from './button'

export const ShareButton = ({ label, onClick, className }) => (
  <button
    role="button"
    className={classNames(
      styles['c-btn'],
      styles['c-btn--secondary'],
      styles['c-btn--share'],
      className
    )}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export const SharedByMeButton = ({ label, onClick, className }) => (
  <button
    role="button"
    className={classNames(styles['c-btn'], styles['coz-btn-shared'], className)}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export const SharedWithMeButton = ({ label, onClick, className }) => (
  <button
    role="button"
    className={classNames(
      styles['c-btn'],
      styles['coz-btn-sharedWithMe'],
      className
    )}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export default ShareButton
