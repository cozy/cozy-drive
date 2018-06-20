/* global __TARGET__ */

import styles from '../styles/main'

import React from 'react'
import classNames from 'classnames'

import { Main as MainUI } from 'cozy-ui/react/Layout'
import BannerClient from '../../components/pushClient/Banner'

const Main = ({ children, working = false }) => (
  <MainUI
    className={classNames(styles['fil-content'], {
      [styles['--working']]: working
    })}
  >
    {__TARGET__ !== 'mobile' && <BannerClient />}
    {children}
  </MainUI>
)

export default Main
