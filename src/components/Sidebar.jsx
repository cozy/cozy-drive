import styles from '../styles/sidebar'

import React from 'react'

import Nav from './Nav'

const Sidebar = ({ t }) => (
  <aside className={styles['coz-sidebar']}>
    <Nav t={t} />
  </aside>
)

export default Sidebar
