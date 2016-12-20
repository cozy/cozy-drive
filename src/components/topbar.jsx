import styles from '../styles/topbar'

import { h } from 'preact'

import Location from './location'
import Toolbar from './toolbar'

const Topbar = () => (
  <div class={ styles['fil-content-header'] }>
    <Location />
    <Toolbar />
  </div>
)

export default Topbar
