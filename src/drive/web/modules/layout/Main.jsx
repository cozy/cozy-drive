/* global __TARGET__ */
import React from 'react'
import classNames from 'classnames'

import { Main as MainUI } from 'cozy-ui/react/Layout'
import BannerClient from 'components/pushClient/Banner'

import styles from 'drive/styles/main'

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
