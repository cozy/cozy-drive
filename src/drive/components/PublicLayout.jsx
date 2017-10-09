import React from 'react'
import classNames from 'classnames'
import { Alerter } from 'cozy-ui/react/Alerter'

import styles from '../styles/layout'

const PublicLayout = ({ children }) => (
  <div className={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Alerter />
    {children}
  </div>
)

export default PublicLayout
