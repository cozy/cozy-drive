import React from 'react'
import classNames from 'classnames'
import { Button, Icon } from 'cozy-ui/react'

import styles from './button'

export const ShareButton = ({ label, onClick, className, ...props }) => (
  <Button
    theme="secondary"
    className={className}
    onClick={() => onClick()}
    {...props}
  >
    <Icon icon="share" />
    {label}
  </Button>
)

export const SharedByMeButton = ({ label, onClick, className, ...props }) => (
  <Button
    className={classNames(styles['coz-btn-shared'], className)}
    onClick={() => onClick()}
    {...props}
  >
    <Icon icon="share" />
    {label}
  </Button>
)

export const SharedWithMeButton = ({ label, onClick, className, ...props }) => (
  <Button
    className={classNames(styles['coz-btn-sharedWithMe'], className)}
    onClick={() => onClick()}
    {...props}
  >
    <Icon icon="share" />
    {label}
  </Button>
)

export default ShareButton
