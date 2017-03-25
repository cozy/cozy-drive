import styles from '../styles/topbar'

import React from 'react'
import { withRouter } from 'react-router'

const Topbar = ({ children }) => (
  <div class={styles['fil-topbar']}>
    {children}
  </div>
)

export default withRouter(Topbar)
