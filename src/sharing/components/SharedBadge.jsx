import React from 'react'
import classNames from 'classnames'
import styles from './badge'

const SharedBadge = ({ byMe, className, small, xsmall }) => (
  <div
    className={classNames(
      styles['shared-badge'],
      className,
      { [styles['--small']]: small },
      { [styles['--xsmall']]: xsmall }
    )}
  >
    <div
      className={classNames(
        styles['shared-badge-icon'],
        styles[byMe ? '--by-me' : '--with-me']
      )}
    />
  </div>
)

export default SharedBadge
