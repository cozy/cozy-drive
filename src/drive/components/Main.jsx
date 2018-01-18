/* global __TARGET__ */

import styles from '../styles/main'

import React from 'react'
import classNames from 'classnames'

import BannerClient from '../../components/pushClient/Banner'

const Main = ({ children, working = false }) => (
  <main
    className={classNames(styles['fil-content'], {
      '--working': working
    })}
  >
    {__TARGET__ !== 'mobile' && <BannerClient />}
    {children}
  </main>
)

export default Main
