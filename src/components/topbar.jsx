import styles from '../styles/topbar'

import React from 'react'

import Location from './location'
import Toolbar from './toolbar'

const Topbar = () => (
  <div class={ styles['fil-content-header'] }>
    <Location />
    <Toolbar />
  </div>
)

export default Topbar
