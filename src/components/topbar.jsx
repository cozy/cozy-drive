import styles from '../styles/topbar'

import React from 'react'

import Toolbar from './toolbar'
import Breadcrump from './breadcrumb'

const Topbar = () => (
  <div class={styles['fil-content-header']}>
    <Breadcrump />
    <Toolbar />
  </div>
)

export default Topbar
