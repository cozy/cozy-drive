import React from 'react'
import classNames from 'classnames'

import styles from '../styles/shareButton'

export const ShareButton = ({ label, onClick }) => (
  <button
    role="button"
    className={classNames('coz-btn', 'coz-btn--secondary', 'coz-btn--share')}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export const SharedByMeButton = ({ label, onClick }) => (
  <button
    role="button"
    className={classNames('coz-btn', styles['coz-btn-shared'])}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export const SharedWithMeButton = ({ label, onClick }) => (
  <button
    role="button"
    className={classNames('coz-btn', styles['coz-btn-sharedWithMe'])}
    onClick={() => onClick()}
  >
    {label}
  </button>
)

export default ShareButton
