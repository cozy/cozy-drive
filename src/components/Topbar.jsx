import styles from '../styles/topbar'

import React from 'react'

const Topbar = ({ children }) => (
  <div class={styles['fil-topbar']}>
    {children}
  </div>
)

export default Topbar
