import styles from '../styles/topbar'

import React from 'react'

import Toolbar from './Toolbar'
import Breadcrump from './Breadcrumb'

const Topbar = () => (
  <div class={styles['fil-content-header']}>
    <Breadcrump />
    <Toolbar />
  </div>
)

export default Topbar
