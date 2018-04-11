import React from 'react'
import classNames from 'classnames'
import { Icon } from 'cozy-ui/react'
import styles from './badge'

const SharedBadge = ({ byMe, className, small, xsmall }) => (
  <div
    className={classNames(
      styles['shared-badge'],
      className,
      { [styles['--small']]: small },
      { [styles['--xsmall']]: xsmall },
      styles[byMe ? '--by-me' : '--with-me']
    )}
  >
    <Icon icon="share" color="white" className={styles['shared-badge-icon']} />
  </div>
)

export default SharedBadge
