import styles from '../styles/sidebar'

import { h } from 'preact'

import Nav from './nav'

const Sidebar = () => (
  <aside class={ styles['fil-sidebar'] }>
    <Nav />
  </aside>
)

export default Sidebar
