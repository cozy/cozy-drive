/* global __TARGET__ */
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Main as MainUI } from 'cozy-ui/react/Layout'
import BannerClient from 'components/pushClient/Banner'

import styles from 'drive/styles/main'

const Main = ({ children, working = false, isPublic = false }) => (
  <MainUI
    className={classNames(styles['fil-content'], {
      [styles['--working']]: working
    })}
  >
    {__TARGET__ !== 'mobile' && !isPublic && <BannerClient />}
    {children}
  </MainUI>
)

Main.propTypes = {
  isPublic: PropTypes.bool,
  working: PropTypes.bool,
  children: PropTypes.array
}
export default Main
