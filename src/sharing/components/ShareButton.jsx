import React from 'react'
import classNames from 'classnames'

import styles from './button'

export const ShareButton = ({ label, onClick }) => (
  <button
    role="button"
    className={classNames(
      styles['c-btn'],
      styles['c-btn--secondary'],
      styles['c-btn--share']
    )}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export const SharedByMeButton = ({ label, onClick }) => (
  <button
    role="button"
    className={classNames(styles['c-btn'], styles['coz-btn-shared'])}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export const SharedWithMeButton = ({ label, onClick }) => (
  <button
    role="button"
    className={classNames(styles['c-btn'], styles['coz-btn-sharedWithMe'])}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export default ShareButton
