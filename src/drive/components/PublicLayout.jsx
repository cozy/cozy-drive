import React from 'react'
import classNames from 'classnames'
import { Alerter } from '../ducks/alerter'

import styles from '../styles/layout'

const PublicLayout = ({ children }) => (
  <div className={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Alerter />
    {children}
  </div>
)

export default PublicLayout
