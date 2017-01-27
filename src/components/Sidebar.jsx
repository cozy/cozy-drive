import styles from '../styles/sidebar'

import React from 'react'

import Nav from './Nav'

const Sidebar = () => (
  <aside className={styles['coz-sidebar']}>
    <Nav />
  </aside>
)

export default Sidebar
