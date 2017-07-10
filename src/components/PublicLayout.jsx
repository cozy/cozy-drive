import React from 'react'
import classNames from 'classnames'
import styles from '../styles/layout'
import { Alerter } from 'cozy-ui/react/Alerter'

const PublicLayout = ({ children }) => (
  <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Alerter />
    {children}
  </div>
)

export default PublicLayout
