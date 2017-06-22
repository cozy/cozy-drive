import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'

import Sidebar from './Sidebar'
import { UploadQueue } from '../ducks/upload'
import { Alerter } from 'cozy-ui/react/Alerter'

const Layout = ({ children }) => (
  <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Sidebar />
    <Alerter />
    { children }
    <UploadQueue />
  </div>
)

export default Layout
