import styles from '../styles/sidebar'

import React from 'react'

import Nav from './Nav'
import ButtonClient from '../components/ButtonClient'

const Sidebar = () => (
  <aside className={styles['coz-sidebar']}>
    <Nav />
    <ButtonClient />
  </aside>
)

export default Sidebar
