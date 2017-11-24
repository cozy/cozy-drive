import styles from '../styles/sidebar'

import React from 'react'

import Nav from '../containers/Nav'
import ButtonClient from '../../components/pushClient/Button'

const Sidebar = () => (
  <aside className={styles['fil-sidebar']}>
    <Nav />
    <ButtonClient />
  </aside>
)

export default Sidebar
