import styles from '../styles/app'

import React from 'react'
import classNames from 'classnames'

import Sidebar from './Sidebar'

const Layout = ({ children }) => (
  <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Sidebar />
    { children }
  </div>
)

export default Layout
