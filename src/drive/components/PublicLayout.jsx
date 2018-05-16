import React from 'react'
import classNames from 'classnames'
import Alerter from 'cozy-ui/react/Alerter'

import styles from '../styles/layout'

const PublicLayout = ({ t, children }) => (
  <div className={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Alerter t={t} />
    {children}
  </div>
)

export default PublicLayout
