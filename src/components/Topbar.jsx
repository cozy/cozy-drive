import styles from '../styles/topbar'

import React from 'react'

import Toolbar from './Toolbar'
import Breadcrumb from './Breadcrumb'

const Topbar = () => (
  <div class={styles['fil-content-header']}>
    <Breadcrumb />
    <Toolbar />
  </div>
)

export default Topbar
