import styles from '../styles/sidebar'

import React from 'react'

import Nav from '../containers/Nav'

const Sidebar = () => (
  <aside class={styles['fil-sidebar']}>
    <Nav />
  </aside>
)

export default Sidebar
